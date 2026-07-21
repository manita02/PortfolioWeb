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
import { TipoCatalogo } from 'src/app/modelo/tipo-catalogo';
import {
  HabilidadModalMode,
  HabilidadModalService,
} from 'src/app/servicio/habilidad-modal.service';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { ModalLoadingService } from 'src/app/servicio/modal-loading.service';
import { TipoHabilidadService } from 'src/app/servicio/tipo-habilidad.service';

@Component({
  selector: 'app-habilidad-form-modal',
  templateUrl: './habilidad-form-modal.component.html',
  styleUrls: ['./habilidad-form-modal.component.css'],
})
export class HabilidadFormModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  mode: HabilidadModalMode = 'create';
  habilidadId?: number;
  habilidad: HabilidadDto | null = null;

  tiposHabilidad: TipoCatalogo[] = [];

  loading = false;
  guardando = false;
  errorMessage = '';

  private modalSub?: Subscription;
  private loadSub?: Subscription;
  private catalogsLoaded = false;

  constructor(
    private modal: HabilidadModalService,
    private modalLoading: ModalLoadingService,
    private habilidadesS: HabilidadesService,
    private tipoHabilidadS: TipoHabilidadService
  ) {}

  ngOnInit(): void {
    this.modalSub = this.modal.state$.subscribe(state => {
      this.isOpen = state.open;
      this.mode = state.mode;
      this.habilidadId = state.habilidadId;

      this.loadSub?.unsubscribe();

      if (state.open) {
        this.errorMessage = '';
        if (state.mode === 'create') {
          this.openCreateModal();
        } else if (state.habilidadId != null) {
          this.openEditModal(state.habilidadId);
        }
      } else {
        this.habilidad = null;
        this.loading = false;
        this.guardando = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
    this.loadSub?.unsubscribe();
    document.body.classList.remove('pf-modal-open');
  }

  get isEdit(): boolean {
    return this.mode === 'edit';
  }

  get title(): string {
    return this.isEdit ? 'Editar habilidad' : 'Agregar habilidad';
  }

  get submitLabel(): string {
    return this.isEdit ? 'Guardar cambios' : 'Agregar habilidad';
  }

  get formValido(): boolean {
    if (!this.habilidad) {
      return false;
    }

    return !!(
      this.habilidad.nombre?.trim() &&
      this.habilidad.img?.trim() &&
      this.habilidad.tipoHabilidadId
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

  onSubmit(form: NgForm): void {
    if (!this.habilidad || !this.formValido || this.guardando) {
      return;
    }

    if (this.isEdit && !confirm('¿Está seguro que desea guardar los cambios?')) {
      return;
    }

    this.guardando = true;
    this.errorMessage = '';

    const payload: HabilidadDto = {
      nombre: this.habilidad.nombre.trim(),
      img: this.habilidad.img.trim(),
      tipoHabilidadId: this.habilidad.tipoHabilidadId,
    };

    const request$ = this.isEdit
      ? this.habilidadesS.update(this.habilidadId!, payload)
      : this.habilidadesS.save(payload);

    request$.subscribe({
      next: () => this.modal.notifySaved(),
      error: err => {
        this.guardando = false;
        this.errorMessage =
          err?.error?.mensaje ||
          err?.error?.message ||
          'Verifique nombre, tipo, imagen y que esté logueado.';
      },
    });
  }

  private openCreateModal(): void {
    this.habilidad = null;
    this.loadSub = this.modalLoading.runLoad(
      this,
      this.getCatalogs$(),
      () => this.initCreateForm(),
      'No se pudieron cargar los datos del formulario.'
    );
  }

  private openEditModal(id: number): void {
    this.habilidad = null;
    this.loadSub = this.modalLoading.runLoad(
      this,
      forkJoin({
        catalogs: this.getCatalogs$(),
        entity: this.habilidadesS.detail(id),
      }),
      ({ entity }) => {
        this.habilidad = {
          ...entity,
          img: entity.img ?? '',
        };
      },
      'No se pudo cargar la habilidad o la sesión expiró.'
    );
  }

  private initCreateForm(): void {
    this.habilidad = {
      nombre: '',
      img: '',
      tipoHabilidadId: undefined,
    };
  }

  private getCatalogs$(): Observable<void> {
    if (this.catalogsLoaded) {
      return of(undefined);
    }

    return this.tipoHabilidadS.lista().pipe(
      tap(data => {
        this.tiposHabilidad = data;
        this.catalogsLoaded = true;
      }),
      map(() => undefined)
    );
  }
}
