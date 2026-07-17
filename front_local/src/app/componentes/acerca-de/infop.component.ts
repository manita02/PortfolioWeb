import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Persona } from 'src/app/modelo/persona';
import { PersonaService } from 'src/app/servicio/persona.service';

@Component({
  selector: 'app-infop',
  templateUrl: './infop.component.html',
  styleUrls: ['./infop.component.css']
})
export class InfopComponent implements OnInit {

  persona: Persona | null = null;
  constructor(private personaS: PersonaService, private activatedRouter: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.params['id'];
    this.personaS.detail(id).subscribe(
      data => {
        this.persona = data;
      }, err => {
        alert("ERROR ---> CAMPO VACÍO ó Tiempo de conexión a expirado(loguéese nuevamente)");
        this.router.navigate(['']);
      }
    )

  }

  onUpdate(): void {
    if (confirm('¿Está seguro que desea guardar los cambios?')) {
      const id = this.activatedRouter.snapshot.params['id'];
      this.personaS.update(id, this.persona).subscribe(
        data => {
          alert("Informacion personal actualizada");
          this.router.navigate(['']);
        }, err => {
          alert("ERROR ---> " + this.mensajeError(err, 'No se pudo actualizar la información personal.'));
        })
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
