import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { EducacionDto } from 'src/app/modelo/educacion.dto';
import { TipoEducacion } from 'src/app/modelo/tipo-educacion';
import { EducacionService } from 'src/app/servicio/educacion.service';
import { EducacionModalService } from 'src/app/servicio/educacion-modal.service';
import { FormModalMode } from 'src/app/servicio/form-modal.types';
import { TipoEducacionService } from 'src/app/servicio/tipo-educacion.service';
import { TokenService } from 'src/app/servicio/token.service';
import { AlertDialogService } from 'src/app/servicio/alert-dialog.service';
import { pdfToObjectUrl } from 'src/app/util/archivo.util';
import { Subscription } from 'rxjs';

type EducationCategory = 'academic' | 'courses' | 'default';

@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css'],
})
export class EducacionComponent implements OnInit, AfterViewInit, OnDestroy {
  educacion: EducacionDto[] = [];
  tiposEducacion: TipoEducacion[] = [];
  selectedTipoId: number | null = null;
  isLogged = false;
  isDesktop = false;
  currentPage = 0;
  pageSize = 1;
  viewportHeight: number | null = null;

  pdfViewerOpen = false;
  pdfViewerSrc: string | null = null;
  pdfViewerTitle = 'Certificado';
  private mobilePdfObjectUrl: string | null = null;

  imageViewerOpen = false;
  imageViewerSrc: string | null = null;
  imageViewerTitle = 'Imagen';

  @ViewChild('carousel') carouselRef?: ElementRef<HTMLElement>;
  @ViewChildren('carouselPage', { read: ElementRef })
  private pageElements?: QueryList<ElementRef<HTMLElement>>;

  private mediaQuery?: MediaQueryList;
  private mediaListener?: (event: MediaQueryListEvent) => void;
  private resizeObserver?: ResizeObserver;
  private viewportHeightFrame?: number;
  private readonly viewportHoverBuffer = 28;
  private readonly viewportPaddingBlock = 32;

  private modalSavedSub?: Subscription;

  constructor(
    private educacionS: EducacionService,
    private tipoEducacionS: TipoEducacionService,
    private tokenService: TokenService,
    private educacionModal: EducacionModalService,
    private alertDialog: AlertDialogService
  ) {}

  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
    this.setupPageSize();
    this.cargarTiposEducacion();
    this.cargarEducacion();
    this.modalSavedSub = this.educacionModal.saved$.subscribe(() => {
      this.cargarEducacion();
    });
  }

  ngAfterViewInit(): void {
    this.pageElements?.changes.subscribe(() => {
      this.observePages();
      this.scheduleViewportHeightUpdate();
    });
    this.observePages();
    this.scheduleViewportHeightUpdate();
  }

  ngOnDestroy(): void {
    this.modalSavedSub?.unsubscribe();
    if (this.viewportHeightFrame != null) {
      cancelAnimationFrame(this.viewportHeightFrame);
    }
    this.resizeObserver?.disconnect();
    if (this.mediaQuery && this.mediaListener) {
      this.mediaQuery.removeEventListener('change', this.mediaListener);
    }
    this.revokeMobilePdfUrl();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.scheduleViewportHeightUpdate();
  }

  get filteredEducacion(): EducacionDto[] {
    if (this.selectedTipoId != null) {
      return this.educacion.filter(edu => edu.tipoEducacionId === this.selectedTipoId);
    }

    /* Todas: Formación Académica primero; dentro de cada grupo se mantiene el orden por fechas del backend */
    return [...this.educacion].sort((a, b) => {
      const aAcademic = this.getEducationCategory(a) === 'academic' ? 0 : 1;
      const bAcademic = this.getEducationCategory(b) === 'academic' ? 0 : 1;
      return aAcademic - bAcademic;
    });
  }

  get pages(): EducacionDto[][] {
    const result: EducacionDto[][] = [];
    const items = this.filteredEducacion;
    for (let i = 0; i < items.length; i += this.pageSize) {
      result.push(items.slice(i, i + this.pageSize));
    }
    return result;
  }

  get totalPages(): number {
    const count = this.filteredEducacion.length;
    if (count === 0) {
      return 0;
    }
    return Math.ceil(count / this.pageSize);
  }

  get canGoPrev(): boolean {
    return this.currentPage > 0;
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages - 1;
  }

  get showNav(): boolean {
    return this.totalPages > 1;
  }

  get showFilters(): boolean {
    return this.educacion.length > 0;
  }

  get trackTransform(): string {
    if (this.totalPages <= 1) {
      return 'translateX(0)';
    }
    const offset = (this.currentPage * 100) / this.totalPages;
    return `translateX(-${offset}%)`;
  }

  isUrl(img: string | null | undefined): boolean {
    return !!img && (img.startsWith('http://') || img.startsWith('https://'));
  }

  hasPdf(edu: EducacionDto): boolean {
    return !!edu.archivoPdf?.trim();
  }

  showCardActions(edu: EducacionDto): boolean {
    return this.isLogged || this.hasPdf(edu);
  }

  openPdf(edu: EducacionDto): void {
    if (!edu.archivoPdf?.trim()) {
      return;
    }

    /* Mobile: nueva pestaña. Desktop/tablet: modal. */
    if (this.isMobileViewport()) {
      this.revokeMobilePdfUrl();
      const url = pdfToObjectUrl(edu.archivoPdf);
      if (!url) {
        return;
      }
      this.mobilePdfObjectUrl = url;
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    this.pdfViewerSrc = edu.archivoPdf;
    this.pdfViewerTitle = edu.nombreE?.trim() || 'Certificado';
    this.pdfViewerOpen = true;
  }

  closePdfViewer(): void {
    this.pdfViewerOpen = false;
    this.pdfViewerSrc = null;
  }

  openImageViewer(edu: EducacionDto): void {
    if (!edu.archivoImagen?.trim()) {
      return;
    }
    this.imageViewerSrc = edu.archivoImagen;
    this.imageViewerTitle = edu.nombreE?.trim() || 'Imagen';
    this.imageViewerOpen = true;
  }

  closeImageViewer(): void {
    this.imageViewerOpen = false;
    this.imageViewerSrc = null;
  }

  private isMobileViewport(): boolean {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  private revokeMobilePdfUrl(): void {
    if (this.mobilePdfObjectUrl) {
      URL.revokeObjectURL(this.mobilePdfObjectUrl);
      this.mobilePdfObjectUrl = null;
    }
  }

  selectFilter(tipoId: number | null): void {
    if (this.selectedTipoId === tipoId) {
      return;
    }
    this.selectedTipoId = tipoId;
    this.currentPage = 0;
    this.scheduleViewportHeightUpdate();
  }

  prevPage(): void {
    if (this.canGoPrev) {
      this.currentPage--;
      this.scheduleViewportHeightUpdate();
    }
  }

  nextPage(): void {
    if (this.canGoNext) {
      this.currentPage++;
      this.scheduleViewportHeightUpdate();
    }
  }

  goToPage(index: number): void {
    if (index >= 0 && index < this.totalPages) {
      this.currentPage = index;
      this.scheduleViewportHeightUpdate();
    }
  }

  getEducationCategory(edu: EducacionDto): EducationCategory {
    const name = this.normalize(edu.tipoEducacion?.nombre ?? '');

    if (name.includes('formacion') || name.includes('academ')) {
      return 'academic';
    }
    if (name.includes('curso') || name.includes('certif') || name.includes('capacit')) {
      return 'courses';
    }
    return 'default';
  }

  getCardCategoryClass(edu: EducacionDto): string {
    return `edu-card--${this.getEducationCategory(edu)}`;
  }

  getEducationBadgeClass(edu: EducacionDto): string {
    return `badge-pf--education-${this.getEducationCategory(edu)}`;
  }

  getEducationIcon(edu: EducacionDto): string {
    const category = this.getEducationCategory(edu);
    switch (category) {
      case 'academic':
        return 'bi-mortarboard-fill';
      case 'courses':
        return 'bi-award-fill';
      default:
        return 'bi-book';
    }
  }

  /** Sin fechaFin = formación en curso (educación no tiene esActual). */
  isEnCurso(edu: EducacionDto): boolean {
    return !edu.fechaFin?.trim();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const carousel = this.carouselRef?.nativeElement;
    if (!carousel || !carousel.contains(document.activeElement)) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prevPage();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nextPage();
    }
  }

  cargarEducacion(): void {
    this.educacionS.lista().subscribe({
      next: data => {
        this.educacion = data;
        if (this.currentPage >= this.totalPages) {
          this.currentPage = Math.max(0, this.totalPages - 1);
        }
        this.scheduleViewportHeightUpdate();
      },
    });
  }

  async delete(id?: number): Promise<void> {
    const ok = await this.alertDialog.confirm(
      '¿Está seguro que desea eliminar esta educación?',
      { variant: 'danger', title: 'Eliminar educación', confirmLabel: 'Eliminar' }
    );
    if (!ok || id == null) {
      return;
    }
    this.educacionS.delete(id).subscribe({
      next: () => this.cargarEducacion(),
      error: () =>
        this.alertDialog.alert('No se pudo borrar la educación', {
          variant: 'danger',
          title: 'Error',
        }),
    });
  }

  openForm(mode: FormModalMode, id?: number): void {
    this.educacionModal.open(mode, id);
  }

  private cargarTiposEducacion(): void {
    this.tipoEducacionS.lista().subscribe({
      next: data => {
        this.tiposEducacion = data;
      },
    });
  }

  private scheduleViewportHeightUpdate(): void {
    if (this.viewportHeightFrame != null) {
      cancelAnimationFrame(this.viewportHeightFrame);
    }
    this.viewportHeightFrame = requestAnimationFrame(() => {
      this.viewportHeightFrame = undefined;
      this.updateViewportHeight();
    });
  }

  private updateViewportHeight(): void {
    const pages = this.pageElements?.toArray();
    if (!pages?.length) {
      this.viewportHeight = null;
      return;
    }

    const activePage = pages[this.currentPage]?.nativeElement as HTMLElement | undefined;
    if (!activePage) {
      return;
    }

    const height = Math.ceil(activePage.getBoundingClientRect().height);
    this.viewportHeight =
      height > 0 ? height + this.viewportPaddingBlock + this.viewportHoverBuffer : null;
  }

  private observePages(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => this.scheduleViewportHeightUpdate());
    this.pageElements?.forEach(pageRef => {
      this.resizeObserver?.observe(pageRef.nativeElement);
    });
  }

  private setupPageSize(): void {
    this.mediaQuery = window.matchMedia('(min-width: 992px)');
    this.updatePageSize(this.mediaQuery.matches);
    this.mediaListener = event => this.updatePageSize(event.matches);
    this.mediaQuery.addEventListener('change', this.mediaListener);
  }

  private updatePageSize(isDesktop: boolean): void {
    this.isDesktop = isDesktop;
    /* Misma densidad que experiencia: 2 cards anchas en desktop */
    const newSize = isDesktop ? 2 : 1;

    if (newSize !== this.pageSize) {
      this.pageSize = newSize;
    }

    this.currentPage = Math.min(this.currentPage, Math.max(0, this.totalPages - 1));
    this.scheduleViewportHeightUpdate();
  }

  private normalize(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
