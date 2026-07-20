import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HabilidadDto } from 'src/app/modelo/habilidad.dto';
import { Organizacion } from 'src/app/modelo/organizacion';
import { ProyectoDto } from 'src/app/modelo/proyecto.dto';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
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
  private catalogsLoaded = false;

  constructor(
    private modal: ProyectoModalService,
    private proyectoS: ProyectoService,
    private organizacionS: OrganizacionService,
    private habilidadesS: HabilidadesService
  ) {}

  ngOnInit(): void {
    this.modalSub = this.modal.state$.subscribe(state => {
      this.isOpen = state.open;
      this.mode = state.mode;
      this.proyectoId = state.proyectoId;

      if (state.open) {
        this.errorMessage = '';
        this.loadCatalogs();
        if (state.mode === 'create') {
          this.initCreateForm();
        } else if (state.proyectoId != null) {
          this.loadProyecto(state.proyectoId);
        }
      } else {
        this.proyecto = null;
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

  private initCreateForm(): void {
    this.loading = false;
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

  private loadProyecto(id: number): void {
    this.loading = true;
    this.proyecto = null;

    this.proyectoS.detail(id).subscribe({
      next: data => {
        this.proyecto = {
          ...data,
          habilidadesIds: data.habilidadesIds ?? [],
          fechaFin: data.fechaFin ?? null,
          imagen: data.imagen ?? '',
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar el proyecto o la sesión expiró.';
      },
    });
  }

  private loadCatalogs(): void {
    if (this.catalogsLoaded) {
      return;
    }

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
