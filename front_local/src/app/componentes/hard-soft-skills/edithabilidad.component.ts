import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabilidadDto } from 'src/app/modelo/habilidad.dto';
import { TipoCatalogo } from 'src/app/modelo/tipo-catalogo';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { TipoHabilidadService } from 'src/app/servicio/tipo-habilidad.service';

@Component({
  selector: 'app-edithabilidad',
  templateUrl: './edithabilidad.component.html',
  styleUrls: ['./edithabilidad.component.css']
})
export class EdithabilidadComponent implements OnInit {
  habilidad: HabilidadDto | null = null;
  tiposHabilidad: TipoCatalogo[] = [];

  constructor(
    private habilidadesS: HabilidadesService,
    private tipoHabilidadS: TipoHabilidadService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.params['id'];

    this.tipoHabilidadS.lista().subscribe({
      next: data => { this.tiposHabilidad = data; },
      error: () => alert('No se pudieron cargar los tipos de habilidad.')
    });

    this.habilidadesS.detail(id).subscribe({
      next: data => { this.habilidad = data; },
      error: () => {
        alert('ERROR ---> CAMPO VACÍO ó Tiempo de conexión a expirado(loguéese nuevamente)');
        this.router.navigate(['']);
      }
    });
  }

  onTipoChange(id: number | null): void {
    if (this.habilidad) {
      this.habilidad.tipoHabilidadId = id ?? undefined;
    }
  }

  onUpdate(): void {
    if (!this.habilidad || !confirm('¿Está seguro que desea guardar los cambios?')) {
      return;
    }
    const id = this.activatedRouter.snapshot.params['id'];
    this.habilidadesS.update(id, this.habilidad).subscribe({
      next: () => {
        alert('Habilidad actualizada');
        this.router.navigate(['']);
      },
      error: () => {
        alert('ERROR ---> CAMPO VACÍO ó Tiempo de conexión a expirado(loguéese nuevamente)');
        this.router.navigate(['']);
      }
    });
  }
}
