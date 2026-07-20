import { Component, OnDestroy, OnInit } from '@angular/core';
import { Banner } from 'src/app/modelo/banner';
import { BannerModalService } from 'src/app/servicio/banner-modal.service';
import { BannerService } from 'src/app/servicio/banner.service';
import { TokenService } from 'src/app/servicio/token.service';
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
    private bannerModal: BannerModalService
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

  openEdit(id: number): void {
    this.bannerModal.openEdit(id);
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

  delete(id?: number){
    if(id != undefined){
      this.bannerS.delete(id).subscribe(
        data => {
          this.cargarBanner(); 
        }, err => {
          alert("No se pudo borrar el banner"); 
        }
      )
    }

  }

}
