import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Redsocial } from 'src/app/modelo/redsocial';
import { RedsocialService } from 'src/app/servicio/redsocial.service';
import { TokenService } from 'src/app/servicio/token.service';

@Component({
  selector: 'app-aplogo',
  templateUrl: './aplogo.component.html',
  styleUrls: ['./aplogo.component.css']
})


export class APlogoComponent implements OnInit {
  isLogged = false;
  redsocial: Redsocial[] = [];

  constructor(private router: Router, private tokenService: TokenService, private proyectoS: RedsocialService) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }


    this.cargarRedSocial();
    if (this.tokenService.getToken()) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }

  }

  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }

  login() {
    this.router.navigate(['/login'])
  }




  cargarRedSocial(): void {
    this.proyectoS.lista().subscribe(
      data => {
        this.redsocial = data;
      }
    )
  }


  delete(id?: number) {
    if (confirm('¿Está seguro que desea eliminar esta red social?')) {
      if (id != undefined) {
        this.proyectoS.delete(id).subscribe(
          data => {
            this.cargarRedSocial();
          }, err => {
            alert("No se pudo borrar la red social");
          }
        )
      }

    }
  }


}
