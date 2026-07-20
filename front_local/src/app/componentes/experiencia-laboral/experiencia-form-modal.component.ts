import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ExperienciaDto } from 'src/app/modelo/experiencia.dto';
import { HabilidadDto } from 'src/app/modelo/habilidad.dto';
import { Organizacion } from 'src/app/modelo/organizacion';
import { TipoCatalogo } from 'src/app/modelo/tipo-catalogo';
import {
  ExperienciaModalMode,
  ExperienciaModalService,
} from 'src/app/servicio/experiencia-modal.service';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { OrganizacionService } from 'src/app/servicio/organizacion.service';
import { SExperienciaService } from 'src/app/servicio/s-experiencia.service';
import { TipoEmpleoService } from 'src/app/servicio/tipo-empleo.service';
import { TipoUbicacionService } from 'src/app/servicio/tipo-ubicacion.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-experiencia-form-modal',
  templateUrl: './experiencia-form-modal.component.html',
  styleUrls: ['./experiencia-form-modal.component.css'],
})
export class ExperienciaFormModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  mode: ExperienciaModalMode = 'create';
  experienciaId?: number;
  experiencia: ExperienciaDto | null = null;

  tiposEmpleo: TipoCatalogo[] = [];
  tiposUbicacion: TipoCatalogo[] = [];
  organizaciones: Organizacion[] = [];
  habilidades: HabilidadDto[] = [];

  loading = false;
  guardando = false;
  errorMessage = '';

  private modalSub?: Subscription;
  private catalogsLoaded = false;

  constructor(
    private modal: ExperienciaModalService,
    private sExperiencia: SExperienciaService,
    private tipoEmpleoS: TipoEmpleoService,
    private tipoUbicacionS: TipoUbicacionService,
    private organizacionS: OrganizacionService,
    private habilidadesS: HabilidadesService
  ) {}

  ngOnInit(): void {
    this.modalSub = this.modal.state$.subscribe(state => {
      this.isOpen = state.open;
      this.mode = state.mode;
      this.experienciaId = state.experienciaId;

      if (state.open) {
        this.errorMessage = '';
        this.loadCatalogs();
        if (state.mode === 'create') {
          this.initCreateForm();
        } else if (state.experienciaId != null) {
          this.loadExperiencia(state.experienciaId);
        }
      } else {
        this.experiencia = null;
        this.loading = false;
        this.guardando = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
    document.body.classList.remove('pf-modal-open');
  }

  get isEdit(): boolean {
    return this.mode === 'edit';
  }

  get title(): string {
    return this.isEdit ? 'Editar experiencia' : 'Agregar experiencia';
  }

  get submitLabel(): string {
    return this.isEdit ? 'Guardar cambios' : 'Agregar experiencia';
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

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen && !this.guardando && !this.loading) {
      this.close();
    }
  }

  close(): void {
    if (this.guardando || this.loading) {
      return;
    }
    this.modal.close();
  }

  onCreateOrg(): void {
    alert(
      'Alta de organización: se implementará en un chat posterior. Creá la org desde el API o la base de datos por ahora.'
    );
  }

  onSubmit(form: NgForm): void {
    if (!this.experiencia || !this.formValido || this.guardando) {
      return;
    }

    if (this.isEdit && !confirm('¿Está seguro que desea guardar los cambios?')) {
      return;
    }

    this.guardando = true;
    this.errorMessage = '';

    const payload: ExperienciaDto = {
      ...this.experiencia,
      fechaFin: this.experiencia.esActual ? null : this.experiencia.fechaFin,
      habilidadesIds: this.experiencia.habilidadesIds ?? [],
    };

    const request$ = this.isEdit
      ? this.sExperiencia.update(this.experienciaId!, payload)
      : this.sExperiencia.save(payload);

    request$.subscribe({
      next: () => this.modal.notifySaved(),
      error: err => {
        this.guardando = false;
        this.errorMessage =
          err?.error?.mensaje ||
          err?.error?.message ||
          'Verifique los campos (fechas MM/yyyy) y que esté logueado.';
      },
    });
  }

  private initCreateForm(): void {
    this.loading = false;
    this.experiencia = {
      nombreE: '',
      descripcionE: '',
      esActual: false,
      fechaInicio: '',
      fechaFin: '',
      tipoEmpleoId: null,
      tipoUbicacionId: null,
      organizacionId: null,
      habilidadesIds: [],
    };
  }

  private loadExperiencia(id: number): void {
    this.loading = true;
    this.experiencia = null;

    this.sExperiencia.detail(id).subscribe({
      next: data => {
        this.experiencia = {
          ...data,
          habilidadesIds: data.habilidadesIds ?? [],
          fechaFin: data.fechaFin ?? null,
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar la experiencia o la sesión expiró.';
      },
    });
  }

  private loadCatalogs(): void {
    if (this.catalogsLoaded) {
      return;
    }

    this.tipoEmpleoS.lista().subscribe({
      next: data => {
        this.tiposEmpleo = data;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los tipos de empleo.';
      },
    });

    this.tipoUbicacionS.lista().subscribe({
      next: data => {
        this.tiposUbicacion = data;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los tipos de ubicación.';
      },
    });

    this.organizacionS.lista().subscribe({
      next: data => {
        this.organizaciones = data;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las organizaciones.';
      },
    });

    this.habilidadesS.lista().subscribe({
      next: data => {
        this.habilidades = data;
        this.catalogsLoaded = true;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las habilidades.';
      },
    });
  }
}
