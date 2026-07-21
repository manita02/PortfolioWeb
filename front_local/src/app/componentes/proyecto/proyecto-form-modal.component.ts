import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HabilidadDto } from 'src/app/modelo/habilidad.dto';
import { Organizacion } from 'src/app/modelo/organizacion';
import { ProyectoDto } from 'src/app/modelo/proyecto.dto';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { ModalLoadingService } from 'src/app/servicio/modal-loading.service';
import {
  OrganizacionModalService,
  OrganizacionSavedEvent,
} from 'src/app/servicio/organizacion-modal.service';
import { OrganizacionService } from 'src/app/servicio/organizacion.service';
import {
  ProyectoModalMode,
  ProyectoModalService,
} from 'src/app/servicio/proyecto-modal.service';
import { ProyectoService } from 'src/app/servicio/proyecto.service';

@Component({
  selector: 'app-proyecto-form-modal',
  templateUrl: './proyecto-form-modal.component.html',
  styleUrls: ['./proyecto-form-modal.component.css'],
})
export class ProyectoFormModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  mode: ProyectoModalMode = 'create';
  proyectoId?: number;
  proyecto: ProyectoDto | null = null;

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
    private modal: ProyectoModalService,
    private modalLoading: ModalLoadingService,
    private proyectoS: ProyectoService,
    private organizacionS: OrganizacionService,
    private organizacionModal: OrganizacionModalService,
    private habilidadesS: HabilidadesService
  ) {}

  ngOnInit(): void {
    this.modalSub = this.modal.state$.subscribe(state => {
      this.isOpen = state.open;
      this.mode = state.mode;
      this.proyectoId = state.proyectoId;

      this.loadSub?.unsubscribe();

      if (state.open) {
        this.errorMessage = '';
        if (state.mode === 'create') {
          this.openCreateModal();
        } else if (state.proyectoId != null) {
          this.openEditModal(state.proyectoId);
        }
      } else {
        this.proyecto = null;
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
    return this.isEdit ? 'Editar proyecto' : 'Agregar proyecto';
  }

  get submitLabel(): string {
    return this.isEdit ? 'Guardar cambios' : 'Agregar proyecto';
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
      this.proyecto.imagen?.trim() &&
      (this.proyecto.esActual || this.proyecto.fechaFin)
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
    if (!this.proyecto || !this.formValido || this.guardando) {
      return;
    }

    if (this.isEdit && !confirm('¿Está seguro que desea guardar los cambios?')) {
      return;
    }

    this.guardando = true;
    this.errorMessage = '';

    const payload: ProyectoDto = {
      ...this.proyecto,
      fechaFin: this.proyecto.esActual ? null : this.proyecto.fechaFin,
      organizacionId: this.proyecto.organizacionId || null,
      habilidadesIds: this.proyecto.habilidadesIds ?? [],
    };

    const request$ = this.isEdit
      ? this.proyectoS.update(this.proyectoId!, payload)
      : this.proyectoS.save(payload);

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
    this.proyecto = null;
    this.loadSub = this.modalLoading.runLoad(
      this,
      this.getCatalogs$(),
      () => this.initCreateForm(),
      'No se pudieron cargar los datos del formulario.'
    );
  }

  private openEditModal(id: number): void {
    this.proyecto = null;
    this.loadSub = this.modalLoading.runLoad(
      this,
      forkJoin({
        catalogs: this.getCatalogs$(),
        entity: this.proyectoS.detail(id),
      }),
      ({ entity }) => {
        this.proyecto = {
          ...entity,
          habilidadesIds: entity.habilidadesIds ?? [],
          fechaFin: entity.fechaFin ?? null,
          imagen: entity.imagen ?? '',
        };
      },
      'No se pudo cargar el proyecto o la sesión expiró.'
    );
  }

  private initCreateForm(): void {
    this.proyecto = {
      nombreE: '',
      descripcionE: '',
      link: '',
      esActual: false,
      fechaInicio: '',
      fechaFin: '',
      organizacionId: null,
      habilidadesIds: [],
      imagen: '',
    };
  }

  private getCatalogs$(): Observable<void> {
    if (this.catalogsLoaded) {
      return of(undefined);
    }

    return forkJoin({
      organizaciones: this.organizacionS.lista(),
      habilidades: this.habilidadesS.lista(),
    }).pipe(
      tap(({ organizaciones, habilidades }) => {
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

        if (!this.proyecto) {
          return;
        }

        if (event.action === 'delete') {
          if (this.proyecto.organizacionId === event.deletedId) {
            this.proyecto.organizacionId = null;
          }
          return;
        }

        if (event.id != null) {
          this.proyecto.organizacionId = event.id;
        }
      },
    });
  }
}
