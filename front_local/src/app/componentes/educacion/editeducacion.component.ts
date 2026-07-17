import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EducacionDto } from 'src/app/modelo/educacion.dto';
import { HabilidadDto } from 'src/app/modelo/habilidad.dto';
import { Organizacion } from 'src/app/modelo/organizacion';
import { TipoCatalogo } from 'src/app/modelo/tipo-catalogo';
import { EducacionService } from 'src/app/servicio/educacion.service';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { OrganizacionService } from 'src/app/servicio/organizacion.service';
import { TipoEducacionService } from 'src/app/servicio/tipo-educacion.service';

@Component({
  selector: 'app-editeducacion',
  templateUrl: './editeducacion.component.html',
  styleUrls: ['./editeducacion.component.css']
})
export class EditeducacionComponent implements OnInit {
  educacion: EducacionDto | null = null;
  tiposEducacion: TipoCatalogo[] = [];
  organizaciones: Organizacion[] = [];
  habilidades: HabilidadDto[] = [];
  guardando = false;

  constructor(
    private educacionS: EducacionService,
    private tipoEducacionS: TipoEducacionService,
    private organizacionS: OrganizacionService,
    private habilidadesS: HabilidadesService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.params['id'];

    this.tipoEducacionS.lista().subscribe({
      next: data => { this.tiposEducacion = data; },
      error: () => alert('No se pudieron cargar los tipos de educación. ¿Reiniciaste el backend?')
    });
    this.organizacionS.lista().subscribe({
      next: data => { this.organizaciones = data; },
      error: () => alert('No se pudieron cargar las organizaciones.')
    });
    this.habilidadesS.lista().subscribe({
      next: data => { this.habilidades = data; },
      error: () => alert('No se pudieron cargar las habilidades.')
    });

    this.educacionS.detail(id).subscribe({
      next: data => {
        this.educacion = {
          ...data,
          habilidadesIds: data.habilidadesIds ?? [],
          fechaFin: data.fechaFin ?? null,
          archivoImagen: data.archivoImagen ?? '',
          archivoPdf: data.archivoPdf ?? ''
        };
      },
      error: () => {
        alert('ERROR ---> No se pudo cargar la educación o la sesión expiró.');
        this.router.navigate(['']);
      }
    });
  }

  get formValido(): boolean {
    if (!this.educacion) {
      return false;
    }
    return !!(
      this.educacion.nombreE?.trim() &&
      this.educacion.descripcionE?.trim() &&
      this.educacion.fechaInicio?.trim() &&
      this.educacion.tipoEducacionId &&
      this.educacion.organizacionId
    );
  }

  onCreateOrg(): void {
    alert('Alta de organización: se implementará en un chat posterior. Creá la org desde el API o la base de datos por ahora.');
  }

  onUpdate(): void {
    if (!this.educacion || !this.formValido || this.guardando) {
      return;
    }
    if (!confirm('¿Está seguro que desea guardar los cambios?')) {
      return;
    }
    this.guardando = true;
    const id = this.activatedRouter.snapshot.params['id'];
    const payload: EducacionDto = {
      ...this.educacion,
      fechaFin: this.educacion.fechaFin || null,
      habilidadesIds: this.educacion.habilidadesIds ?? [],
      archivoImagen: this.educacion.archivoImagen || null,
      archivoPdf: this.educacion.archivoPdf || null
    };
    this.educacionS.update(id, payload).subscribe({
      next: () => {
        alert('Educación actualizada');
        this.router.navigate(['']);
      },
      error: err => {
        this.guardando = false;
        const msg = err?.error?.mensaje || err?.error?.message || 'Verifique los campos (fechas MM/yyyy) y que esté logueado.';
        alert(`ERROR ---> ${msg}`);
      }
    });
  }
}
