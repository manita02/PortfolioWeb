import { Component, OnInit } from '@angular/core';
import { Banner } from 'src/app/modelo/banner';
import { BannerService } from 'src/app/servicio/banner.service';
import { TokenService } from 'src/app/servicio/token.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  banner: Banner[] = []; 

  constructor(private bannerS: BannerService, private tokenService: TokenService) { }
  isLogged = false; 
  ngOnInit(): void {
    this.cargarBanner();
    if(this.tokenService.getToken()){
      this.isLogged = true; 
    } else{
      this.isLogged = false; 
    }
  }

  cargarBanner(): void{
    this.bannerS.lista().subscribe(
      data => {
        this.banner = data; 
      }
    )
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
