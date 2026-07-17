import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HabilidadDto } from 'src/app/modelo/habilidad.dto';
import { Organizacion } from 'src/app/modelo/organizacion';
import { ProyectoDto } from 'src/app/modelo/proyecto.dto';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { OrganizacionService } from 'src/app/servicio/organizacion.service';
import { ProyectoService } from 'src/app/servicio/proyecto.service';

@Component({
  selector: 'app-editproyecto',
  templateUrl: './editproyecto.component.html',
  styleUrls: ['./editproyecto.component.css']
})
export class EditproyectoComponent implements OnInit {
  proyecto: ProyectoDto | null = null;
  organizaciones: Organizacion[] = [];
  habilidades: HabilidadDto[] = [];
  guardando = false;

  constructor(
    private proyectoS: ProyectoService,
    private organizacionS: OrganizacionService,
    private habilidadesS: HabilidadesService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.activatedRouter.snapshot.params['id'];

    this.organizacionS.lista().subscribe({
      next: data => { this.organizaciones = data; },
      error: () => alert('No se pudieron cargar las organizaciones.')
    });
    this.habilidadesS.lista().subscribe({
      next: data => { this.habilidades = data; },
      error: () => alert('No se pudieron cargar las habilidades.')
    });

    this.proyectoS.detail(id).subscribe({
      next: data => {
        this.proyecto = {
          ...data,
          habilidadesIds: data.habilidadesIds ?? [],
          fechaFin: data.fechaFin ?? null,
          imagen: data.imagen ?? ''
        };
      },
      error: () => {
        alert('ERROR ---> No se pudo cargar el proyecto o la sesión expiró.');
        this.router.navigate(['']);
      }
    });
  }

  get formValido(): boolean {
    if (!this.proyecto) {
      return false;
    }
    return !!(
      this.proyecto.nombreE?.trim() &&
      this.proyecto.descripcionE?.trim() &&
      this.proyecto.link?.trim() &&
      this.proyecto.fechaInicio?.trim() &&
      this.proyecto.imagen &&
      (this.proyecto.esActual || this.proyecto.fechaFin)
    );
  }

  onCreateOrg(): void {
    alert('Alta de organización: se implementará en un chat posterior. Creá la org desde el API o la base de datos por ahora.');
  }

  onUpdate(): void {
    if (!this.proyecto || !this.formValido || this.guardando) {
      return;
    }
    if (!confirm('¿Está seguro que desea guardar los cambios?')) {
      return;
    }
    this.guardando = true;
    const id = this.activatedRouter.snapshot.params['id'];
    const payload: ProyectoDto = {
      ...this.proyecto,
      fechaFin: this.proyecto.esActual ? null : this.proyecto.fechaFin,
      organizacionId: this.proyecto.organizacionId || null,
      habilidadesIds: this.proyecto.habilidadesIds ?? []
    };
    this.proyectoS.update(id, payload).subscribe({
      next: () => {
        alert('Proyecto actualizado');
        this.router.navigate(['']);
      },
      error: err => {
        this.guardando = false;
        const msg = err?.error?.mensaje || err?.error?.message || 'Verifique los campos (fechas MM/yyyy, imagen ≤ 2MB) y que esté logueado.';
        alert(`ERROR ---> ${msg}`);
      }
    });
  }
}
