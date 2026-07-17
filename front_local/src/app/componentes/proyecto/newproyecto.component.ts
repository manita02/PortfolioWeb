import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HabilidadDto } from 'src/app/modelo/habilidad.dto';
import { Organizacion } from 'src/app/modelo/organizacion';
import { ProyectoDto } from 'src/app/modelo/proyecto.dto';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { OrganizacionService } from 'src/app/servicio/organizacion.service';
import { ProyectoService } from 'src/app/servicio/proyecto.service';

@Component({
  selector: 'app-newproyecto',
  templateUrl: './newproyecto.component.html',
  styleUrls: ['./newproyecto.component.css']
})
export class NewproyectoComponent implements OnInit {
  proyecto: ProyectoDto = {
    nombreE: '',
    descripcionE: '',
    link: '',
    esActual: false,
    fechaInicio: '',
    fechaFin: '',
    organizacionId: null,
    habilidadesIds: [],
    imagen: ''
  };

  organizaciones: Organizacion[] = [];
  habilidades: HabilidadDto[] = [];
  guardando = false;

  constructor(
    private proyectoS: ProyectoService,
    private organizacionS: OrganizacionService,
    private habilidadesS: HabilidadesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.organizacionS.lista().subscribe({
      next: data => { this.organizaciones = data; },
      error: () => alert('No se pudieron cargar las organizaciones.')
    });
    this.habilidadesS.lista().subscribe({
      next: data => { this.habilidades = data; },
      error: () => alert('No se pudieron cargar las habilidades.')
    });
  }

  get formValido(): boolean {
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

  onCreate(): void {
    if (!this.formValido || this.guardando) {
      return;
    }
    this.guardando = true;
    const payload: ProyectoDto = {
      ...this.proyecto,
      fechaFin: this.proyecto.esActual ? null : this.proyecto.fechaFin,
      organizacionId: this.proyecto.organizacionId || null,
      habilidadesIds: this.proyecto.habilidadesIds ?? []
    };
    this.proyectoS.save(payload).subscribe({
      next: () => {
        alert('Proyecto añadido');
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
