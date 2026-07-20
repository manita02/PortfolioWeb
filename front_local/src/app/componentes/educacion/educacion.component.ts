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
import { TipoEducacionService } from 'src/app/servicio/tipo-educacion.service';
import { TokenService } from 'src/app/servicio/token.service';
import { toPdfDataUri } from 'src/app/util/archivo.util';

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

  @ViewChild('carousel') carouselRef?: ElementRef<HTMLElement>;
  @ViewChildren('carouselPage', { read: ElementRef })
  private pageElements?: QueryList<ElementRef<HTMLElement>>;

  private mediaQuery?: MediaQueryList;
  private mediaListener?: (event: MediaQueryListEvent) => void;
  private resizeObserver?: ResizeObserver;
  private viewportHeightFrame?: number;
  private readonly viewportHoverBuffer = 28;
  private readonly viewportPaddingBlock = 32;

  constructor(
    private educacionS: EducacionService,
    private tipoEducacionS: TipoEducacionService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
    this.setupPageSize();
    this.cargarTiposEducacion();
    this.cargarEducacion();
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
    if (this.viewportHeightFrame != null) {
      cancelAnimationFrame(this.viewportHeightFrame);
    }
    this.resizeObserver?.disconnect();
    if (this.mediaQuery && this.mediaListener) {
      this.mediaQuery.removeEventListener('change', this.mediaListener);
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.scheduleViewportHeightUpdate();
  }

  get filteredEducacion(): EducacionDto[] {
    if (this.selectedTipoId == null) {
      return this.educacion;
    }
    return this.educacion.filter(edu => edu.tipoEducacionId === this.selectedTipoId);
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

  getPdfUri(edu: EducacionDto): string | null {
    return toPdfDataUri(edu.archivoPdf);
  }

  showCardActions(edu: EducacionDto): boolean {
    return this.isLogged || !!this.getPdfUri(edu);
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

  delete(id?: number): void {
    if (!confirm('¿Está seguro que desea eliminar esta educación?') || id == null) {
      return;
    }
    this.educacionS.delete(id).subscribe({
      next: () => this.cargarEducacion(),
      error: () => alert('No se pudo borrar la educación'),
    });
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
    const newSize = isDesktop ? 6 : 1;

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
