import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EducacionDto } from 'src/app/modelo/educacion.dto';
import { HabilidadDto } from 'src/app/modelo/habilidad.dto';
import { Organizacion } from 'src/app/modelo/organizacion';
import { TipoCatalogo } from 'src/app/modelo/tipo-catalogo';
import { EducacionService } from 'src/app/servicio/educacion.service';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { OrganizacionService } from 'src/app/servicio/organizacion.service';
import { TipoEducacionService } from 'src/app/servicio/tipo-educacion.service';

@Component({
  selector: 'app-neweducacion',
  templateUrl: './neweducacion.component.html',
  styleUrls: ['./neweducacion.component.css']
})
export class NeweducacionComponent implements OnInit {
  educacion: EducacionDto = {
    nombreE: '',
    descripcionE: '',
    fechaInicio: '',
    fechaFin: null,
    tipoEducacionId: null,
    organizacionId: null,
    habilidadesIds: [],
    archivoImagen: '',
    archivoPdf: ''
  };

  tiposEducacion: TipoCatalogo[] = [];
  organizaciones: Organizacion[] = [];
  habilidades: HabilidadDto[] = [];
  guardando = false;

  constructor(
    private educacionS: EducacionService,
    private tipoEducacionS: TipoEducacionService,
    private organizacionS: OrganizacionService,
    private habilidadesS: HabilidadesService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
  }

  get formValido(): boolean {
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

  onCreate(): void {
    if (!this.formValido || this.guardando) {
      return;
    }
    this.guardando = true;
    const payload: EducacionDto = {
      ...this.educacion,
      fechaFin: this.educacion.fechaFin || null,
      habilidadesIds: this.educacion.habilidadesIds ?? [],
      archivoImagen: this.educacion.archivoImagen || null,
      archivoPdf: this.educacion.archivoPdf || null
    };
    this.educacionS.save(payload).subscribe({
      next: () => {
        alert('Educación añadida');
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
