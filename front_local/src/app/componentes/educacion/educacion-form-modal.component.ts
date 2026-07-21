import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
import { ModalLoadingService } from 'src/app/servicio/modal-loading.service';
import {
  OrganizacionModalService,
  OrganizacionSavedEvent,
} from 'src/app/servicio/organizacion-modal.service';
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
  private loadSub?: Subscription;
  private orgSavedSub?: Subscription;
  private catalogsLoaded = false;

  constructor(
    private modal: EducacionModalService,
    private modalLoading: ModalLoadingService,
    private educacionS: EducacionService,
    private tipoEducacionS: TipoEducacionService,
    private organizacionS: OrganizacionService,
    private organizacionModal: OrganizacionModalService,
    private habilidadesS: HabilidadesService
  ) {}

  ngOnInit(): void {
    this.modalSub = this.modal.state$.subscribe(state => {
      this.isOpen = state.open;
      this.mode = state.mode;
      this.educacionId = state.educacionId;

      this.loadSub?.unsubscribe();

      if (state.open) {
        this.errorMessage = '';
        if (state.mode === 'create') {
          this.openCreateModal();
        } else if (state.educacionId != null) {
          this.openEditModal(state.educacionId);
        }
      } else {
        this.educacion = null;
        this.loading = false;
        this.guardando = false;
      }
    });

    this.orgSavedSub = this.organizacionModal.saved$.subscribe(event =>
      this.refreshOrganizacionesFromModal(event)
    );
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
    this.loadSub?.unsubscribe();
    this.orgSavedSub?.unsubscribe();
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
    if (this.organizacionModal.state.open) {
      return;
    }
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
    this.organizacionModal.open();
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

  private openCreateModal(): void {
    this.educacion = null;
    this.loadSub = this.modalLoading.runLoad(
      this,
      this.getCatalogs$(),
      () => this.initCreateForm(),
      'No se pudieron cargar los datos del formulario.'
    );
  }

  private openEditModal(id: number): void {
    this.educacion = null;
    this.loadSub = this.modalLoading.runLoad(
      this,
      forkJoin({
        catalogs: this.getCatalogs$(),
        entity: this.educacionS.detail(id),
      }),
      ({ entity }) => {
        this.educacion = {
          ...entity,
          habilidadesIds: entity.habilidadesIds ?? [],
          fechaFin: entity.fechaFin ?? null,
          archivoImagen: entity.archivoImagen ?? '',
          archivoPdf: entity.archivoPdf ?? '',
        };
      },
      'No se pudo cargar la educación o la sesión expiró.'
    );
  }

  private initCreateForm(): void {
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

  private getCatalogs$(): Observable<void> {
    if (this.catalogsLoaded) {
      return of(undefined);
    }

    return forkJoin({
      tiposEducacion: this.tipoEducacionS.lista(),
      organizaciones: this.organizacionS.lista(),
      habilidades: this.habilidadesS.lista(),
    }).pipe(
      tap(({ tiposEducacion, organizaciones, habilidades }) => {
        this.tiposEducacion = tiposEducacion;
        this.organizaciones = organizaciones;
        this.habilidades = habilidades;
        this.catalogsLoaded = true;
      }),
      map(() => undefined)
    );
  }

  private refreshOrganizacionesFromModal(event: OrganizacionSavedEvent): void {
    this.organizacionS.lista().subscribe({
      next: organizaciones => {
        this.organizaciones = organizaciones;
        this.catalogsLoaded = true;

        if (!this.educacion) {
          return;
        }

        if (event.action === 'delete') {
          if (this.educacion.organizacionId === event.deletedId) {
            this.educacion.organizacionId = null;
          }
          return;
        }

        if (event.id != null) {
          this.educacion.organizacionId = event.id;
        }
      },
    });
  }
}
