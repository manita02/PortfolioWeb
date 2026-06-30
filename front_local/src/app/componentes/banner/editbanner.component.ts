import { HttpErrorResponse } from '@angular/common/http';

import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Banner } from 'src/app/modelo/banner';

import { BannerService } from 'src/app/servicio/banner.service';



@Component({

  selector: 'app-editbanner',

  templateUrl: './editbanner.component.html',

  styleUrls: ['./editbanner.component.css']

})

export class EditbannerComponent implements OnInit {



  banner: Banner | null = null;

  guardando = false;



  constructor(

    private sBanner: BannerService,

    private activatedRouter: ActivatedRoute,

    private router: Router

  ) { }



  ngOnInit(): void {

    const id = Number(this.activatedRouter.snapshot.params['id']);

    this.sBanner.detail(id).subscribe({

      next: data => {

        this.banner = data;

      },

      error: err => {

        alert('ERROR ---> ' + this.mensajeError(err, 'No se pudo cargar el banner.'));

        this.router.navigate(['']);

      }

    });

  }



  onUpdate(): void {

    if (!this.banner?.titulo?.trim() || !this.banner?.img?.trim()) {

      alert('Completá el título y seleccioná una imagen antes de guardar.');

      return;

    }



    if (confirm('¿Está seguro que desea guardar los cambios?')) {

      const id = Number(this.activatedRouter.snapshot.params['id']);

      const payload: Banner = {

        titulo: this.banner.titulo.trim(),

        img: this.banner.img.trim()

      };



      this.guardando = true;

      this.sBanner.update(id, payload).subscribe({

        next: () => {

          alert('Banner actualizado');

          this.router.navigate(['']);

        },

        error: err => {

          alert('ERROR ---> ' + this.mensajeError(err, 'No se pudo actualizar el banner.'));

          this.guardando = false;

        },

        complete: () => {

          this.guardando = false;

        }

      });

    }

  }



  private mensajeError(err: unknown, fallback: string): string {

    if (!(err instanceof HttpErrorResponse)) {

      return fallback;

    }

    if (err.status === 0) {

      return 'No se pudo conectar con el servidor. Verificá que el backend esté en ejecución.';

    }

    if (err.status === 401) {

      return 'Sesión expirada. Volvé a iniciar sesión.';

    }

    if (err.status === 413) {

      return 'La imagen es demasiado grande para enviar al servidor. Elegí un archivo de menos de 750 KB en tu PC.';

    }

    const body = err.error;

    if (body?.mensaje) {

      return body.mensaje;

    }

    if (body?.message) {

      return body.message;

    }

    return fallback;

  }

}


