import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HabilidadDto } from 'src/app/modelo/habilidad.dto';
import { TipoCatalogo } from 'src/app/modelo/tipo-catalogo';
import { runFormModalOpenLoad } from 'src/app/servicio/form-modal-load.helper';
import { FormModalMode } from 'src/app/servicio/form-modal.types';
import { HabilidadModalService } from 'src/app/servicio/habilidad-modal.service';
import { HabilidadesService } from 'src/app/servicio/habilidades.service';
import { ModalLoadingService } from 'src/app/servicio/modal-loading.service';
import { TipoHabilidadService } from 'src/app/servicio/tipo-habilidad.service';
import { AlertDialogService } from 'src/app/servicio/alert-dialog.service';

@Component({
  selector: 'app-habilidad-form-modal',
  templateUrl: './habilidad-form-modal.component.html',
  styleUrls: ['./habilidad-form-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HabilidadFormModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  mode: FormModalMode = 'create';
  entityId?: number;
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
    private tipoHabilidadS: TipoHabilidadService,
    private alertDialog: AlertDialogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.modalSub = this.modal.state$.subscribe(state => {
      this.isOpen = state.open;
      this.mode = state.mode;
      this.entityId = state.entityId;

      this.loadSub?.unsubscribe();

      if (state.open) {
        this.errorMessage = '';
        if (
          state.mode === 'create' ||
          (state.mode === 'edit' && state.entityId != null)
        ) {
          this.openForm();
        }
      } else {
        this.habilidad = null;
        this.loading = false;
        this.guardando = false;
      }
      this.cdr.markForCheck();
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

  async onSubmit(form: NgForm): Promise<void> {
    if (!this.habilidad || !this.formValido || this.guardando) {
      return;
    }

    if (this.isEdit) {
      const ok = await this.alertDialog.confirm(
        '¿Está seguro que desea guardar los cambios?',
        { variant: 'warning', title: 'Guardar cambios', confirmLabel: 'Guardar' }
      );
      if (!ok) {
        return;
      }
    }

    this.guardando = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    const payload: HabilidadDto = {
      nombre: this.habilidad.nombre.trim(),
      img: this.habilidad.img.trim(),
      tipoHabilidadId: this.habilidad.tipoHabilidadId,
    };

    const request$ = this.isEdit
      ? this.habilidadesS.update(this.entityId!, payload)
      : this.habilidadesS.save(payload);

    request$.subscribe({
      next: () => this.modal.notifySaved(),
      error: err => {
        this.guardando = false;
        this.errorMessage =
          err?.error?.mensaje ||
          err?.error?.message ||
          'Verifique nombre, tipo, imagen y que esté logueado.';
        this.cdr.markForCheck();
      },
    });
  }

  private openForm(): void {
    this.loadSub = runFormModalOpenLoad<HabilidadDto>({
      host: this,
      modalLoading: this.modalLoading,
      mode: this.mode,
      entityId: this.entityId,
      clearEntity: () => {
        this.habilidad = null;
      },
      getCatalogs$: () => this.getCatalogs$(),
      loadEntity$: id => this.habilidadesS.detail(id),
      onCreateReady: () => this.initCreateForm(),
      onEditReady: entity => {
        this.habilidad = {
          ...entity,
          img: entity.img ?? '',
        };
        this.cdr.markForCheck();
      },
      createErrorMessage: 'No se pudieron cargar los datos del formulario.',
      editErrorMessage: 'No se pudo cargar la habilidad o la sesión expiró.',
    });
  }

  private initCreateForm(): void {
    this.habilidad = {
      nombre: '',
      img: '',
      tipoHabilidadId: undefined,
    };
    this.cdr.markForCheck();
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
