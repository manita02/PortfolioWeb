import { Component, OnDestroy, OnInit } from '@angular/core';
import { Banner } from 'src/app/modelo/banner';
import { BannerModalService } from 'src/app/servicio/banner-modal.service';
import { BannerService } from 'src/app/servicio/banner.service';
import { TokenService } from 'src/app/servicio/token.service';
import { AlertDialogService } from 'src/app/servicio/alert-dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
})
export class BannerComponent implements OnInit, OnDestroy {

  banner: Banner[] = []; 
  isLogged = false;

  private modalSavedSub?: Subscription;

  constructor(
    private bannerS: BannerService,
    private tokenService: TokenService,
    private bannerModal: BannerModalService,
    private alertDialog: AlertDialogService
  ) {}

  ngOnInit(): void {
    this.cargarBanner();
    this.isLogged = !!this.tokenService.getToken();
    this.modalSavedSub = this.bannerModal.saved$.subscribe(() => {
      this.cargarBanner();
    });
  }

  ngOnDestroy(): void {
    this.modalSavedSub?.unsubscribe();
  }

  openForm(mode: 'edit', id: number): void {
    this.bannerModal.open(mode, id);
  }

  cargarBanner(): void{
    this.bannerS.lista().subscribe(
      data => {
        this.banner = data; 
      }
    )
  }

  /** Compatibilidad con registros antiguos que guardaban URL externa. */
  isUrl(img: string | undefined): boolean {
    return !!img && (img.startsWith('http://') || img.startsWith('https://'));
  }

  delete(id?: number): void {
    if (id == null) {
      return;
    }
    this.bannerS.delete(id).subscribe({
      next: () => this.cargarBanner(),
      error: () =>
        this.alertDialog.alert('No se pudo borrar el banner', {
          variant: 'danger',
          title: 'Error',
        }),
    });
  }

}
