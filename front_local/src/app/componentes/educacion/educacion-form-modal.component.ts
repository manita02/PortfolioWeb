import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EducacionDto } from 'src/app/modelo/educacion.dto';
import { HabilidadDto } from 'src/app/modelo/habilidad.dto';
import { Organizacion } from 'src/app/modelo/organizacion';
import { TipoCatalogo } from 'src/app/modelo/tipo-catalogo';
import {
  EducacionModalMode,
  EducacionModalService,
} from 'src/app/servicio/educacion-modal.service';
import { EducacionService } from 'src/app/servicio/educacion.service';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { OrganizacionService } from 'src/app/servicio/organizacion.service';
import { TipoEducacionService } from 'src/app/servicio/tipo-educacion.service';

@Component({
  selector: 'app-educacion-form-modal',
  templateUrl: './educacion-form-modal.component.html',
  styleUrls: ['./educacion-form-modal.component.css'],
})
export class EducacionFormModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  mode: EducacionModalMode = 'create';
  educacionId?: number;
  educacion: EducacionDto | null = null;

  tiposEducacion: TipoCatalogo[] = [];
  organizaciones: Organizacion[] = [];
  habilidades: HabilidadDto[] = [];

  loading = false;
  guardando = false;
  errorMessage = '';

  private modalSub?: Subscription;
  private catalogsLoaded = false;

  constructor(
    private modal: EducacionModalService,
    private educacionS: EducacionService,
    private tipoEducacionS: TipoEducacionService,
    private organizacionS: OrganizacionService,
    private habilidadesS: HabilidadesService
  ) {}

  ngOnInit(): void {
    this.modalSub = this.modal.state$.subscribe(state => {
      this.isOpen = state.open;
      this.mode = state.mode;
      this.educacionId = state.educacionId;

      if (state.open) {
        this.errorMessage = '';
        this.loadCatalogs();
        if (state.mode === 'create') {
          this.initCreateForm();
        } else if (state.educacionId != null) {
          this.loadEducacion(state.educacionId);
        }
      } else {
        this.educacion = null;
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
    return this.isEdit ? 'Editar educación' : 'Agregar educación';
  }

  get submitLabel(): string {
    return this.isEdit ? 'Guardar cambios' : 'Agregar educación';
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
    if (!this.educacion || !this.formValido || this.guardando) {
      return;
    }

    if (this.isEdit && !confirm('¿Está seguro que desea guardar los cambios?')) {
      return;
    }

    this.guardando = true;
    this.errorMessage = '';

    const payload: EducacionDto = {
      ...this.educacion,
      fechaFin: this.educacion.fechaFin || null,
      habilidadesIds: this.educacion.habilidadesIds ?? [],
      archivoImagen: this.educacion.archivoImagen || null,
      archivoPdf: this.educacion.archivoPdf || null,
    };

    const request$ = this.isEdit
      ? this.educacionS.update(this.educacionId!, payload)
      : this.educacionS.save(payload);

    request$.subscribe({
      next: () => this.modal.notifySaved(),
      error: err => {
        this.guardando = false;
        this.errorMessage =
          err?.error?.mensaje ||
          err?.error?.message ||
          'Verifique los campos y que esté logueado.';
      },
    });
  }

  private initCreateForm(): void {
    this.loading = false;
    this.educacion = {
      nombreE: '',
      descripcionE: '',
      fechaInicio: '',
      fechaFin: null,
      tipoEducacionId: null,
      organizacionId: null,
      habilidadesIds: [],
      archivoImagen: '',
      archivoPdf: '',
    };
  }

  private loadEducacion(id: number): void {
    this.loading = true;
    this.educacion = null;

    this.educacionS.detail(id).subscribe({
      next: data => {
        this.educacion = {
          ...data,
          habilidadesIds: data.habilidadesIds ?? [],
          fechaFin: data.fechaFin ?? null,
          archivoImagen: data.archivoImagen ?? '',
          archivoPdf: data.archivoPdf ?? '',
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar la educación o la sesión expiró.';
      },
    });
  }

  private loadCatalogs(): void {
    if (this.catalogsLoaded) {
      return;
    }

    this.tipoEducacionS.lista().subscribe({
      next: data => {
        this.tiposEducacion = data;
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los tipos de educación.';
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
