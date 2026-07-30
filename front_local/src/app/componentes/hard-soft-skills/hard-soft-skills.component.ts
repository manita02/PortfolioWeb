import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { HabilidadDto } from 'src/app/modelo/habilidad.dto';
import { TipoHabilidad } from 'src/app/modelo/tipo-habilidad';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { FormModalMode } from 'src/app/servicio/form-modal.types';
import { HabilidadModalService } from 'src/app/servicio/habilidad-modal.service';
import { TipoHabilidadService } from 'src/app/servicio/tipo-habilidad.service';
import { TokenService } from 'src/app/servicio/token.service';
import { AlertDialogService } from 'src/app/servicio/alert-dialog.service';
import { Subscription } from 'rxjs';

export interface GrupoHabilidades {
  tipo: string;
  tipoId: number | null;
  habilidades: HabilidadDto[];
}

type SkillAccent = 'backend' | 'frontend' | 'frameworks' | 'database' | 'tools' | 'methodology' | 'language' | 'default';

@Component({
  selector: 'app-hard-soft-skills',
  templateUrl: './hard-soft-skills.component.html',
  styleUrls: ['./hard-soft-skills.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HardSoftSkillsComponent implements OnInit, AfterViewInit, OnDestroy {
  habilidades: HabilidadDto[] = [];
  tiposHabilidad: TipoHabilidad[] = [];
  selectedTipoId: number | null = null;
  isLogged = false;
  pageSize = 6;

  @ViewChildren('carouselPage', { read: ElementRef })
  private carouselPages?: QueryList<ElementRef<HTMLElement>>;

  private currentPage = 0;
  private groupPages = new Map<string, number>();
  private viewportHeights = new Map<string, number>();
  private mediaQueries: MediaQueryList[] = [];
  private mediaListeners: Array<(event: MediaQueryListEvent) => void> = [];
  private resizeObserver?: ResizeObserver;
  private viewportHeightFrame?: number;
  private readonly viewportHoverBuffer = 24;
  private readonly viewportPaddingBlock = 64;

  private modalSavedSub?: Subscription;

  constructor(
    private habilidadesS: HabilidadesService,
    private tipoHabilidadS: TipoHabilidadService,
    private tokenService: TokenService,
    private habilidadModal: HabilidadModalService,
    private alertDialog: AlertDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
    this.setupPageSize();
    this.cargarTiposHabilidad();
    this.cargarHabilidad();
    this.modalSavedSub = this.habilidadModal.saved$.subscribe(() => {
      this.cargarHabilidad();
    });
  }

  ngOnDestroy(): void {
    this.modalSavedSub?.unsubscribe();
    if (this.viewportHeightFrame != null) {
      cancelAnimationFrame(this.viewportHeightFrame);
    }
    this.resizeObserver?.disconnect();
    this.mediaQueries.forEach((query, index) => {
      const listener = this.mediaListeners[index];
      if (listener) {
        query.removeEventListener('change', listener);
      }
    });
  }

  ngAfterViewInit(): void {
    this.carouselPages?.changes.subscribe(() => {
      this.observePages();
      this.scheduleViewportHeightUpdate();
    });
    this.observePages();
    this.scheduleViewportHeightUpdate();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.clampAllPages();
    this.scheduleViewportHeightUpdate();
  }

  get filteredHabilidades(): HabilidadDto[] {
    if (this.selectedTipoId == null) {
      return this.habilidades;
    }
    return this.habilidades.filter(h => this.getTipoId(h) === this.selectedTipoId);
  }

  get gruposVisibles(): GrupoHabilidades[] {
    return this.agruparPorTipo(this.filteredHabilidades);
  }

  get showGroupedView(): boolean {
    return this.selectedTipoId == null;
  }

  get showFilters(): boolean {
    return this.habilidades.length > 0;
  }

  get flatPages(): HabilidadDto[][] {
    return this.paginateItems(this.filteredHabilidades);
  }

  get flatTotalPages(): number {
    return this.getTotalPagesForItems(this.filteredHabilidades);
  }

  get flatCurrentPage(): number {
    return this.currentPage;
  }

  get flatShowNav(): boolean {
    return this.flatTotalPages > 1;
  }

  get flatCanGoPrev(): boolean {
    return this.currentPage > 0;
  }

  get flatCanGoNext(): boolean {
    return this.currentPage < this.flatTotalPages - 1;
  }

  get flatTrackTransform(): string {
    return this.getTrackTransform(this.currentPage, this.flatTotalPages);
  }

  getViewportHeight(key: string): number | null {
    const height = this.viewportHeights.get(key);
    return height != null && height > 0 ? height : null;
  }

  isUrl(img: string | null | undefined): boolean {
    return !!img && (img.startsWith('http://') || img.startsWith('https://'));
  }

  selectFilter(tipoId: number | null): void {
    if (this.selectedTipoId === tipoId) {
      return;
    }
    this.selectedTipoId = tipoId;
    this.resetPagination();
    this.scheduleViewportHeightUpdate();
    this.cdr.markForCheck();
  }

  onFilterSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectFilter(value === '' ? null : Number(value));
  }

  trackByTipoId(_: number, tipo: TipoHabilidad): number {
    return tipo.id;
  }

  trackByGrupoTipo(_: number, grupo: GrupoHabilidades): string {
    return grupo.tipo;
  }

  trackByHabilidadId(_: number, h: HabilidadDto): number {
    return h.id!;
  }

  trackByPageIndex(index: number): number {
    return index;
  }

  getAccentForHabilidad(h: HabilidadDto): SkillAccent {
    return this.getAccentForTipoName(h.tipoHabilidad?.nombre ?? '');
  }

  getAccentForGrupo(grupo: GrupoHabilidades): SkillAccent {
    return this.getAccentForTipoName(grupo.tipo);
  }

  getPillAccentClass(h: HabilidadDto): string {
    return `skill-pill--${this.getAccentForHabilidad(h)}`;
  }

  getGroupAccentClass(grupo: GrupoHabilidades): string {
    return `skills-group--${this.getAccentForGrupo(grupo)}`;
  }

  getGroupPages(grupo: GrupoHabilidades): HabilidadDto[][] {
    return this.paginateItems(grupo.habilidades);
  }

  getGroupTotalPages(grupo: GrupoHabilidades): number {
    return this.getTotalPagesForItems(grupo.habilidades);
  }

  getGroupCurrentPage(grupo: GrupoHabilidades): number {
    return this.groupPages.get(grupo.tipo) ?? 0;
  }

  showNavForGroup(grupo: GrupoHabilidades): boolean {
    return this.getGroupTotalPages(grupo) > 1;
  }

  canGoPrevGroup(grupo: GrupoHabilidades): boolean {
    return this.getGroupCurrentPage(grupo) > 0;
  }

  canGoNextGroup(grupo: GrupoHabilidades): boolean {
    return this.getGroupCurrentPage(grupo) < this.getGroupTotalPages(grupo) - 1;
  }

  getGroupTrackTransform(grupo: GrupoHabilidades): string {
    return this.getTrackTransform(this.getGroupCurrentPage(grupo), this.getGroupTotalPages(grupo));
  }

  prevFlatPage(): void {
    if (this.flatCanGoPrev) {
      this.currentPage--;
      this.scheduleViewportHeightUpdate();
    }
  }

  nextFlatPage(): void {
    if (this.flatCanGoNext) {
      this.currentPage++;
      this.scheduleViewportHeightUpdate();
    }
  }

  goToFlatPage(index: number): void {
    if (index >= 0 && index < this.flatTotalPages) {
      this.currentPage = index;
      this.scheduleViewportHeightUpdate();
    }
  }

  prevGroupPage(grupo: GrupoHabilidades): void {
    const page = this.getGroupCurrentPage(grupo);
    if (page > 0) {
      this.groupPages.set(grupo.tipo, page - 1);
      this.scheduleViewportHeightUpdate();
    }
  }

  nextGroupPage(grupo: GrupoHabilidades): void {
    const page = this.getGroupCurrentPage(grupo);
    const total = this.getGroupTotalPages(grupo);
    if (page < total - 1) {
      this.groupPages.set(grupo.tipo, page + 1);
      this.scheduleViewportHeightUpdate();
    }
  }

  goToGroupPage(grupo: GrupoHabilidades, index: number): void {
    const total = this.getGroupTotalPages(grupo);
    if (index >= 0 && index < total) {
      this.groupPages.set(grupo.tipo, index);
      this.scheduleViewportHeightUpdate();
    }
  }

  onCarouselKeydown(event: KeyboardEvent, context: 'flat' | GrupoHabilidades): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (context === 'flat') {
        this.prevFlatPage();
      } else {
        this.prevGroupPage(context);
      }
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (context === 'flat') {
        this.nextFlatPage();
      } else {
        this.nextGroupPage(context);
      }
    }
  }

  cargarHabilidad(): void {
    this.habilidadesS.lista().subscribe({
      next: data => {
        this.habilidades = data;
        this.clampAllPages();
        this.scheduleViewportHeightUpdate();
        this.cdr.markForCheck();
      },
    });
  }

  openForm(mode: FormModalMode, id?: number): void {
    this.habilidadModal.open(mode, id);
  }

  async delete(id?: number): Promise<void> {
    const ok = await this.alertDialog.confirm(
      '¿Está seguro que desea eliminar esta habilidad?',
      { variant: 'danger', title: 'Eliminar habilidad', confirmLabel: 'Eliminar' }
    );
    if (!ok || id == null) {
      return;
    }
    this.habilidadesS.delete(id).subscribe({
      next: () => this.cargarHabilidad(),
      error: () =>
        this.alertDialog.alert('No se pudo borrar la habilidad.', {
          variant: 'danger',
          title: 'Error',
        }),
    });
  }

  private cargarTiposHabilidad(): void {
    this.tipoHabilidadS.lista().subscribe({
      next: data => {
        this.tiposHabilidad = data;
        this.applyDefaultLenguajesFilter();
        this.cdr.markForCheck();
      },
    });
  }

  private applyDefaultLenguajesFilter(): void {
    if (this.selectedTipoId != null) {
      return;
    }
    const lenguajes = this.tiposHabilidad.find(tipo =>
      this.normalize(tipo.nombre ?? '').includes('lenguaje')
    );
    if (lenguajes?.id == null) {
      return;
    }
    this.selectedTipoId = lenguajes.id;
    this.resetPagination();
    this.scheduleViewportHeightUpdate();
  }

  private paginateItems(items: HabilidadDto[]): HabilidadDto[][] {
    const result: HabilidadDto[][] = [];
    for (let i = 0; i < items.length; i += this.pageSize) {
      result.push(items.slice(i, i + this.pageSize));
    }
    return result;
  }

  private getTotalPagesForItems(items: HabilidadDto[]): number {
    if (items.length === 0) {
      return 0;
    }
    return Math.ceil(items.length / this.pageSize);
  }

  private getTrackTransform(currentPage: number, totalPages: number): string {
    if (totalPages <= 1 || currentPage <= 0) {
      return 'translate3d(0, 0, 0)';
    }
    return `translate3d(-${currentPage * 100}%, 0, 0)`;
  }

  private resetPagination(): void {
    this.currentPage = 0;
    this.groupPages.clear();
  }

  private clampAllPages(): void {
    this.currentPage = Math.min(this.currentPage, Math.max(0, this.flatTotalPages - 1));

    for (const grupo of this.gruposVisibles) {
      const total = this.getGroupTotalPages(grupo);
      const current = this.getGroupCurrentPage(grupo);
      if (current >= total) {
        this.groupPages.set(grupo.tipo, Math.max(0, total - 1));
      }
    }
  }

  private setupPageSize(): void {
    const configs: Array<{ query: string; pageSize: number }> = [
      { query: '(min-width: 992px)', pageSize: 36 },
      { query: '(min-width: 768px)', pageSize: 16 },
      { query: '(min-width: 576px)', pageSize: 9 },
      { query: '(max-width: 575px)', pageSize: 6 },
    ];

    const applyFromWindow = (): void => {
      const matched =
        configs.find(entry => window.matchMedia(entry.query).matches)?.pageSize ??
        configs[configs.length - 1].pageSize;
      this.applyPageSize(matched);
    };

    configs.forEach(entry => {
      const query = window.matchMedia(entry.query);
      const listener = (): void => applyFromWindow();
      query.addEventListener('change', listener);
      this.mediaQueries.push(query);
      this.mediaListeners.push(listener);
    });

    applyFromWindow();
  }

  private applyPageSize(newPageSize: number): void {
    if (newPageSize !== this.pageSize) {
      this.pageSize = newPageSize;
      this.clampAllPages();
      this.scheduleViewportHeightUpdate();
      this.cdr.markForCheck();
    }
  }

  private scheduleViewportHeightUpdate(): void {
    if (this.viewportHeightFrame != null) {
      cancelAnimationFrame(this.viewportHeightFrame);
    }
    this.viewportHeightFrame = requestAnimationFrame(() => {
      this.viewportHeightFrame = undefined;
      this.updateAllViewportHeights();
      this.cdr.markForCheck();
    });
  }

  private updateAllViewportHeights(): void {
    if (this.showGroupedView) {
      for (const grupo of this.gruposVisibles) {
        this.updateViewportHeightForKey(grupo.tipo, this.getGroupCurrentPage(grupo));
      }
      return;
    }
    this.updateViewportHeightForKey('flat', this.currentPage);
  }

  private updateViewportHeightForKey(key: string, _currentPage: number): void {
    const pages = this.carouselPages?.toArray().filter(
      ref => ref.nativeElement.dataset['carouselKey'] === key
    );

    if (!pages?.length) {
      this.viewportHeights.delete(key);
      return;
    }

    /* Altura fija del viewport: la mayor de todas las páginas del carrusel. */
    let maxHeight = 0;
    for (const pageRef of pages) {
      const height = Math.ceil(pageRef.nativeElement.getBoundingClientRect().height);
      if (height > maxHeight) {
        maxHeight = height;
      }
    }

    if (maxHeight > 0) {
      this.viewportHeights.set(
        key,
        maxHeight + this.viewportPaddingBlock + this.viewportHoverBuffer
      );
    }
  }

  private observePages(): void {
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver?.disconnect();
    this.resizeObserver = new ResizeObserver(() => this.scheduleViewportHeightUpdate());
    this.carouselPages?.forEach(pageRef => {
      this.resizeObserver?.observe(pageRef.nativeElement);
    });
  }

  private getTipoId(h: HabilidadDto): number | null {
    return h.tipoHabilidadId ?? h.tipoHabilidad?.id ?? null;
  }

  private agruparPorTipo(habilidades: HabilidadDto[]): GrupoHabilidades[] {
    const map = new Map<string, GrupoHabilidades>();

    for (const h of habilidades) {
      const tipo = h.tipoHabilidad?.nombre ?? 'Sin categoría';
      const tipoId = this.getTipoId(h);

      if (!map.has(tipo)) {
        map.set(tipo, { tipo, tipoId, habilidades: [] });
      }
      map.get(tipo)!.habilidades.push(h);
    }

    for (const grupo of map.values()) {
      grupo.habilidades.sort((a, b) =>
        a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
      );
    }

    return Array.from(map.values()).sort((a, b) => {
      const idA = a.tipoId ?? Number.MAX_SAFE_INTEGER;
      const idB = b.tipoId ?? Number.MAX_SAFE_INTEGER;
      return idA - idB;
    });
  }

  private getAccentForTipoName(nombre: string): SkillAccent {
    const key = this.normalize(nombre);

    if (key.includes('lenguaje')) {
      return 'backend';
    }
    if (key.includes('backend')) {
      return 'backend';
    }
    if (key.includes('frontend')) {
      return 'frontend';
    }
    if (key.includes('servicio')) {
      return 'tools';
    }
    if (key.includes('framework') || key.includes('librer')) {
      return 'frameworks';
    }
    if (key.includes('base') || key.includes('datos')) {
      return 'database';
    }
    if (key.includes('herramient')) {
      return 'tools';
    }
    if (key.includes('metodolog')) {
      return 'methodology';
    }
    if (key.includes('idioma')) {
      return 'language';
    }
    return 'default';
  }

  private normalize(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
