import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LoginModalService } from 'src/app/servicio/login-modal.service';
import { RedsocialModalService } from 'src/app/servicio/redsocial-modal.service';
import { FormModalMode } from 'src/app/servicio/form-modal.types';
import { Redsocial } from 'src/app/modelo/redsocial';
import { RedsocialService } from 'src/app/servicio/redsocial.service';
import { TokenService } from 'src/app/servicio/token.service';
import { AlertDialogService } from 'src/app/servicio/alert-dialog.service';
import { Subscription } from 'rxjs';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-aplogo',
  templateUrl: './aplogo.component.html',
})
export class APlogoComponent implements OnInit, AfterViewInit, OnDestroy {
  isLogged = false;
  isAdmin = false;
  redsocial: Redsocial[] = [];
  menuOpen = false;

  readonly navItems: NavItem[] = [
    { id: 'inicio', label: 'Inicio', icon: 'bi-house-door' },
    { id: 'acerca-de', label: 'Acerca de', icon: 'bi-person' },
    { id: 'experiencia', label: 'Experiencia', icon: 'bi-briefcase' },
    { id: 'educacion', label: 'Educación', icon: 'bi-mortarboard' },
    { id: 'habilidades', label: 'Habilidades', icon: 'bi-lightning' },
    { id: 'proyectos', label: 'Proyectos', icon: 'bi-folder2-open' },
  ];

  private resizeObserver?: ResizeObserver;
  private modalSavedSub?: Subscription;

  constructor(
    private loginModal: LoginModalService,
    private tokenService: TokenService,
    private proyectoS: RedsocialService,
    private redsocialModal: RedsocialModalService,
    private alertDialog: AlertDialogService,
    private el: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.isLogged = this.tokenService.isLoggedIn();
    this.isAdmin = this.tokenService.isAdmin();
    this.cargarRedSocial();
    this.modalSavedSub = this.redsocialModal.saved$.subscribe(() => {
      this.cargarRedSocial();
    });
  }

  ngAfterViewInit(): void {
    const bar = this.getNavBarElement();
    if (bar && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.syncNavBarHeight());
      this.resizeObserver.observe(bar);
    }
    this.syncNavBarHeight();
  }

  ngOnDestroy(): void {
    this.modalSavedSub?.unsubscribe();
    this.resizeObserver?.disconnect();
    document.documentElement.style.removeProperty('--nav-bar-height');
    document.body.classList.remove('hero-nav-open');
  }

  @HostListener('window:resize')
  onResize(): void {
    this.syncNavBarHeight();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.menuOpen) {
      this.closeMenu();
    }
  }

  isUrl(img: string | undefined): boolean {
    return !!img && (img.startsWith('http://') || img.startsWith('https://'));
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
    document.body.classList.toggle('hero-nav-open', this.menuOpen);
  }

  closeMenu(): void {
    this.menuOpen = false;
    document.body.classList.remove('hero-nav-open');
  }

  goToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    this.closeMenu();

    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (history.replaceState) {
      history.replaceState(null, '', `#${sectionId}`);
    }
  }

  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }

  login(): void {
    this.loginModal.open();
  }

  cargarRedSocial(): void {
    this.proyectoS.lista().subscribe(data => {
      this.redsocial = data;
      setTimeout(() => this.syncNavBarHeight(), 0);
    });
  }

  async delete(id?: number): Promise<void> {
    if (!this.tokenService.isAdmin()) {
      return;
    }
    const ok = await this.alertDialog.confirm(
      '¿Está seguro que desea eliminar esta red social?',
      { variant: 'danger', title: 'Eliminar red social', confirmLabel: 'Eliminar' }
    );
    if (!ok || id == null) {
      return;
    }
    this.proyectoS.delete(id).subscribe({
      next: () => this.cargarRedSocial(),
      error: () =>
        this.alertDialog.alert('No se pudo borrar la red social', {
          variant: 'danger',
          title: 'Error',
        }),
    });
  }

  openForm(mode: FormModalMode, id?: number): void {
    this.redsocialModal.open(mode, id);
  }

  private getNavBarElement(): HTMLElement | null {
    return this.el.nativeElement.querySelector('.hero-bar');
  }

  private syncNavBarHeight(): void {
    const bar = this.getNavBarElement();
    if (!bar) {
      return;
    }

    const height = bar.offsetHeight;
    if (height > 0) {
      document.documentElement.style.setProperty('--nav-bar-height', `${height}px`);
    }
  }
}
