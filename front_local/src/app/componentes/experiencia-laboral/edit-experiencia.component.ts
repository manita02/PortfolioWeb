import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExperienciaDto } from 'src/app/modelo/experiencia.dto';
import { HabilidadDto } from 'src/app/modelo/habilidad.dto';
import { Organizacion } from 'src/app/modelo/organizacion';
import { TipoCatalogo } from 'src/app/modelo/tipo-catalogo';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { OrganizacionService } from 'src/app/servicio/organizacion.service';
import { SExperienciaService } from 'src/app/servicio/s-experiencia.service';
import { TipoEmpleoService } from 'src/app/servicio/tipo-empleo.service';
import { TipoUbicacionService } from 'src/app/servicio/tipo-ubicacion.service';

@Component({
  selector: 'app-edit-experiencia',
  templateUrl: './edit-experiencia.component.html',
  styleUrls: ['./edit-experiencia.component.css']
})
export class EditExperienciaComponent implements OnInit {
  experiencia: ExperienciaDto | null = null;
  tiposEmpleo: TipoCatalogo[] = [];
  tiposUbicacion: TipoCatalogo[] = [];
  organizaciones: Organizacion[] = [];
  habilidades: HabilidadDto[] = [];
  guardando = false;

  constructor(
    private sExperiencia: SExperienciaService,
    private tipoEmpleoS: TipoEmpleoService,
    private tipoUbicacionS: TipoUbicacionService,
    private organizacionS: OrganizacionService,
    private habilidadesS: HabilidadesService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.params['id'];

    this.tipoEmpleoS.lista().subscribe({
      next: data => { this.tiposEmpleo = data; },
      error: () => alert('No se pudieron cargar los tipos de empleo.')
    });
    this.tipoUbicacionS.lista().subscribe({
      next: data => { this.tiposUbicacion = data; },
      error: () => alert('No se pudieron cargar los tipos de ubicación.')
    });
    this.organizacionS.lista().subscribe({
      next: data => { this.organizaciones = data; },
      error: () => alert('No se pudieron cargar las organizaciones.')
    });
    this.habilidadesS.lista().subscribe({
      next: data => { this.habilidades = data; },
      error: () => alert('No se pudieron cargar las habilidades.')
    });

    this.sExperiencia.detail(id).subscribe({
      next: data => {
        this.experiencia = {
          ...data,
          habilidadesIds: data.habilidadesIds ?? [],
          fechaFin: data.fechaFin ?? null
        };
      },
      error: () => {
        alert('ERROR ---> No se pudo cargar la experiencia o la sesión expiró.');
        this.router.navigate(['']);
      }
    });
  }

  get formValido(): boolean {
    if (!this.experiencia) {
      return false;
    }
    return !!(
      this.experiencia.nombreE?.trim() &&
      this.experiencia.descripcionE?.trim() &&
      this.experiencia.fechaInicio?.trim() &&
      this.experiencia.tipoEmpleoId &&
      this.experiencia.tipoUbicacionId &&
      this.experiencia.organizacionId &&
      (this.experiencia.esActual || this.experiencia.fechaFin)
    );
  }

  onCreateOrg(): void {
    alert('Alta de organización: se implementará en un chat posterior. Creá la org desde el API o la base de datos por ahora.');
  }

  onUpdate(): void {
    if (!this.experiencia || !this.formValido || this.guardando) {
      return;
    }
    if (!confirm('¿Está seguro que desea guardar los cambios?')) {
      return;
    }
    this.guardando = true;
    const id = this.activatedRouter.snapshot.params['id'];
    const payload: ExperienciaDto = {
      ...this.experiencia,
      fechaFin: this.experiencia.esActual ? null : this.experiencia.fechaFin,
      habilidadesIds: this.experiencia.habilidadesIds ?? []
    };
    this.sExperiencia.update(id, payload).subscribe({
      next: () => {
        alert('Experiencia actualizada');
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
