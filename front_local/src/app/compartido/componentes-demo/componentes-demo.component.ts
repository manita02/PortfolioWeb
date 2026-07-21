import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HabilidadDto } from '../../modelo/habilidad.dto';
import { Organizacion } from '../../modelo/organizacion';
import { TipoCatalogo } from '../../modelo/tipo-catalogo';
import { HabilidadesService } from '../../servicio/habilidades.service';
import {
  OrganizacionModalService,
  OrganizacionSavedEvent,
} from '../../servicio/organizacion-modal.service';
import { OrganizacionService } from '../../servicio/organizacion.service';
import { TipoEducacionService } from '../../servicio/tipo-educacion.service';
import { TipoEmpleoService } from '../../servicio/tipo-empleo.service';
import { TipoHabilidadService } from '../../servicio/tipo-habilidad.service';
import { TipoUbicacionService } from '../../servicio/tipo-ubicacion.service';

/** Sandbox de componentes compartidos — ruta /dev/componentes */
@Component({
  selector: 'app-componentes-demo',
  templateUrl: './componentes-demo.component.html',
  styleUrls: ['./componentes-demo.component.css']
})
export class ComponentesDemoComponent implements OnInit, OnDestroy {
  // Mock base64: 1x1 PNG transparente
  mockImageBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  mockPdfBase64 =
    'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCAyMDAgMjAwXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjEwIDEwMCBUZAooRGVtbyBQREYpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjggMDAwMDAgbiAKMDAwMDAwMDEyNSAwMDAwMCBuIAowMDAwMDAwMjI0IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNQovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMjkzCiUlRU9G';

  uploadValue = '';
  fileUploadImage = '';
  fileUploadPdf = '';

  fechaInicio = '2020-01';
  fechaFin = '2024-06';
  esActual = false;

  selectedTipoEmpleoId: number | null = null;
  selectedOrgId: number | null = null;
  selectedSkillIds: number[] = [];

  organizaciones: Organizacion[] = [];
  tiposEmpleo: TipoCatalogo[] = [];
  tiposUbicacion: TipoCatalogo[] = [];
  habilidades: HabilidadDto[] = [];

  mockOrg: Organizacion = {
    id: 1,
    nombre: 'Universidad Demo',
    ubicacion: 'Buenos Aires, AR',
    urlWeb: 'https://example.com',
    logoImg: this.mockImageBase64
  };

  mockSkills: HabilidadDto[] = [
    { id: 1, nombre: 'Angular', tipoHabilidad: { id: 1, nombre: 'Frontend' } },
    { id: 2, nombre: 'Java', tipoHabilidad: { id: 2, nombre: 'Backend' } },
    { id: 3, nombre: 'MySQL', tipoHabilidad: { id: 2, nombre: 'Backend' } }
  ];

  apiStatus = {
    organizaciones: 'cargando...',
    tiposEmpleo: 'cargando...',
    tiposUbicacion: 'cargando...',
    habilidades: 'cargando...',
    tiposEducacion: 'no probado',
    tiposHabilidad: 'no probado'
  };

  private orgSavedSub?: Subscription;

  constructor(
    private organizacionService: OrganizacionService,
    private organizacionModal: OrganizacionModalService,
    private tipoEmpleoService: TipoEmpleoService,
    private tipoUbicacionService: TipoUbicacionService,
    private tipoEducacionService: TipoEducacionService,
    private tipoHabilidadService: TipoHabilidadService,
    private habilidadesService: HabilidadesService
  ) {}

  ngOnInit(): void {
    this.organizacionService.lista().subscribe({
      next: data => {
        this.organizaciones = data;
        this.apiStatus.organizaciones = `${data.length} registros`;
        if (data.length > 0) {
          this.mockOrg = data[0];
        }
      },
      error: () => { this.apiStatus.organizaciones = 'error'; }
    });

    this.tipoEmpleoService.lista().subscribe({
      next: data => {
        this.tiposEmpleo = data;
        this.apiStatus.tiposEmpleo = `${data.length} registros`;
      },
      error: () => { this.apiStatus.tiposEmpleo = 'error'; }
    });

    this.tipoUbicacionService.lista().subscribe({
      next: data => {
        this.tiposUbicacion = data;
        this.apiStatus.tiposUbicacion = `${data.length} registros`;
      },
      error: () => { this.apiStatus.tiposUbicacion = 'error'; }
    });

    this.habilidadesService.lista().subscribe({
      next: data => {
        this.habilidades = data;
        this.apiStatus.habilidades = `${data.length} registros`;
      },
      error: () => { this.apiStatus.habilidades = 'error'; }
    });

    this.tipoEducacionService.lista().subscribe({
      next: data => { this.apiStatus.tiposEducacion = `${data.length} registros`; },
      error: err => { this.apiStatus.tiposEducacion = err.message || 'sin endpoint'; }
    });

    this.tipoHabilidadService.lista().subscribe({
      next: data => { this.apiStatus.tiposHabilidad = `${data.length} registros`; },
      error: err => { this.apiStatus.tiposHabilidad = err.message || 'sin endpoint'; }
    });

    this.orgSavedSub = this.organizacionModal.saved$.subscribe(event =>
      this.refreshOrganizacionesFromModal(event)
    );
  }

  ngOnDestroy(): void {
    this.orgSavedSub?.unsubscribe();
  }

  onCreateOrg(): void {
    this.organizacionModal.open();
  }

  private refreshOrganizacionesFromModal(event: OrganizacionSavedEvent): void {
    this.organizacionService.lista().subscribe({
      next: data => {
        this.organizaciones = data;
        this.apiStatus.organizaciones = `${data.length} registros`;

        if (event.action === 'delete') {
          if (this.selectedOrgId === event.deletedId) {
            this.selectedOrgId = null;
          }
          return;
        }

        if (event.id != null) {
          this.selectedOrgId = event.id;
        }
      },
    });
  }
}
