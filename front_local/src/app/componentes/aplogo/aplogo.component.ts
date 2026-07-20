import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LoginModalService } from 'src/app/servicio/login-modal.service';
import { RedsocialModalService } from 'src/app/servicio/redsocial-modal.service';
import { Redsocial } from 'src/app/modelo/redsocial';
import { RedsocialService } from 'src/app/servicio/redsocial.service';
import { TokenService } from 'src/app/servicio/token.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-aplogo',
  templateUrl: './aplogo.component.html',
})
export class APlogoComponent implements OnInit, AfterViewInit, OnDestroy {
  isLogged = false;
  redsocial: Redsocial[] = [];
  private resizeObserver?: ResizeObserver;
  private modalSavedSub?: Subscription;

  constructor(
    private loginModal: LoginModalService,
    private tokenService: TokenService,
    private proyectoS: RedsocialService,
    private redsocialModal: RedsocialModalService,
    private el: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.isLogged = !!this.tokenService.getToken();
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
  }

  @HostListener('window:resize')
  onResize(): void {
    this.syncNavBarHeight();
  }

  isUrl(img: string | undefined): boolean {
    return !!img && (img.startsWith('http://') || img.startsWith('https://'));
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

  delete(id?: number): void {
    if (confirm('¿Está seguro que desea eliminar esta red social?')) {
      if (id != undefined) {
        this.proyectoS.delete(id).subscribe(
          () => {
            this.cargarRedSocial();
          },
          () => {
            alert('No se pudo borrar la red social');
          }
        );
      }
    }
  }

  openCreate(): void {
    this.redsocialModal.openCreate();
  }

  openEdit(id: number): void {
    this.redsocialModal.openEdit(id);
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
