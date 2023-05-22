import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Habilidades } from 'src/app/modelo/habilidades';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';

@Component({
  selector: 'app-edithabilidad',
  templateUrl: './edithabilidad.component.html',
  styleUrls: ['./edithabilidad.component.css']
})
export class EdithabilidadComponent implements OnInit {

  habilidades: Habilidades = null;
  constructor(private habilidadesS: HabilidadesService, private activatedRouter: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.params['id'];
    this.habilidadesS.detail(id).subscribe(
      data => {
        this.habilidades = data;
      }, err => {
        alert("ERROR ---> CAMPO VACÍO ó Tiempo de conexión a expirado(loguéese nuevamente)");
        this.router.navigate(['']);
      }
    )

  }

  onUpdate(): void {
    if (confirm('¿Está seguro que desea guardar los cambios?')) {
      const id = this.activatedRouter.snapshot.params['id'];
      this.habilidadesS.update(id, this.habilidades).subscribe(
        data => {
          alert("Habilidad actualizada");
          this.router.navigate(['']);
        }, err => {
          alert("ERROR ---> CAMPO VACÍO ó Tiempo de conexión a expirado(loguéese nuevamente)");
          this.router.navigate(['']);
        })



    }

  }

}
