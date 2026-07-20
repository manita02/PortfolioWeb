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
import { ProyectoDto } from 'src/app/modelo/proyecto.dto';
import { ProyectoService } from 'src/app/servicio/proyecto.service';
import { TokenService } from 'src/app/servicio/token.service';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css'],
})
export class ProyectoComponent implements OnInit, AfterViewInit, OnDestroy {
  proyecto: ProyectoDto[] = [];
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
    private proyectoS: ProyectoService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
    this.setupPageSize();
    this.cargarProyecto();
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

  get pages(): ProyectoDto[][] {
    const result: ProyectoDto[][] = [];
    for (let i = 0; i < this.proyecto.length; i += this.pageSize) {
      result.push(this.proyecto.slice(i, i + this.pageSize));
    }
    return result;
  }

  get totalPages(): number {
    if (this.proyecto.length === 0) {
      return 0;
    }
    return Math.ceil(this.proyecto.length / this.pageSize);
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

  cargarProyecto(): void {
    this.proyectoS.lista().subscribe({
      next: data => {
        this.proyecto = data;
        if (this.currentPage >= this.totalPages) {
          this.currentPage = Math.max(0, this.totalPages - 1);
        }
        this.scheduleViewportHeightUpdate();
      },
    });
  }

  delete(id?: number): void {
    if (!confirm('¿Está seguro que desea eliminar este proyecto?') || id == null) {
      return;
    }
    this.proyectoS.delete(id).subscribe({
      next: () => this.cargarProyecto(),
      error: () => alert('No se pudo borrar el proyecto'),
    });
  }

  goProject(link: string): void {
    window.open(link, '_blank');
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
}
