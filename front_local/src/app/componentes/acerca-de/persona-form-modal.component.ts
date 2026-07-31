import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { of, Subscription } from 'rxjs';
import { Persona } from 'src/app/modelo/persona';
import { ModalLoadingService } from 'src/app/servicio/modal-loading.service';
import { PersonaModalService } from 'src/app/servicio/persona-modal.service';
import { runFormModalOpenLoad } from 'src/app/servicio/form-modal-load.helper';
import { FormModalMode } from 'src/app/servicio/form-modal.types';
import { PersonaService } from 'src/app/servicio/persona.service';
import { AlertDialogService } from 'src/app/servicio/alert-dialog.service';

@Component({
  selector: 'app-persona-form-modal',
  templateUrl: './persona-form-modal.component.html',
  styleUrls: ['./persona-form-modal.component.css'],
})
export class PersonaFormModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  mode: FormModalMode = 'edit';
  entityId?: number;
  persona: Persona | null = null;

  loading = false;
  guardando = false;
  errorMessage = '';

  private modalSub?: Subscription;
  private loadSub?: Subscription;

  constructor(
    private modal: PersonaModalService,
    private modalLoading: ModalLoadingService,
    private personaS: PersonaService,
    private alertDialog: AlertDialogService
  ) {}

  ngOnInit(): void {
    this.modalSub = this.modal.state$.subscribe(state => {
      this.isOpen = state.open;
      this.mode = state.mode;
      this.entityId = state.entityId;

      this.loadSub?.unsubscribe();

      if (
        state.open &&
        state.mode === 'edit' &&
        state.entityId != null
      ) {
        this.errorMessage = '';
        this.openForm();
      } else {
        this.persona = null;
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

  get title(): string {
    return 'Editar información personal';
  }

  get submitLabel(): string {
    return 'Guardar cambios';
  }

  get formValido(): boolean {
    if (!this.persona) {
      return false;
    }

    return !!(
      this.persona.nombre?.trim() &&
      this.persona.apellido?.trim() &&
      this.persona.profesion?.trim() &&
      this.persona.img?.trim() &&
      this.persona.acercaDe?.trim()
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
    if (!this.persona || !this.formValido || this.guardando || this.entityId == null) {
      return;
    }

    const ok = await this.alertDialog.confirm(
      '¿Está seguro que desea guardar los cambios?',
      { variant: 'warning', title: 'Guardar cambios', confirmLabel: 'Guardar' }
    );
    if (!ok) {
      return;
    }

    this.guardando = true;
    this.errorMessage = '';

    const payload: Persona = {
      nombre: this.persona.nombre.trim(),
      apellido: this.persona.apellido.trim(),
      profesion: this.persona.profesion.trim(),
      img: this.persona.img.trim(),
      acercaDe: this.persona.acercaDe.trim(),
    };

    this.personaS.update(this.entityId, payload).subscribe({
      next: () => this.modal.notifySaved(),
      error: err => {
        this.guardando = false;
        this.errorMessage = this.mensajeError(
          err,
          'No se pudo actualizar la persona.'
        );
      },
    });
  }

  private openForm(): void {
    this.loadSub = runFormModalOpenLoad<Persona>({
      host: this,
      modalLoading: this.modalLoading,
      mode: 'edit',
      entityId: this.entityId,
      clearEntity: () => {
        this.persona = null;
      },
      getCatalogs$: () => of(null),
      loadEntity$: id => this.personaS.detail(id),
      onCreateReady: () => {},
      onEditReady: data => {
        this.persona = { ...data };
      },
      createErrorMessage: '',
      editErrorMessage: 'No se pudo cargar la persona.',
    });
  }

  private mensajeError(err: unknown, fallback: string): string {
    if (!(err instanceof HttpErrorResponse)) {
      return fallback;
    }

    if (err.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }

    if (err.status === 401) {
      return 'Sesión expirada. Volvé a iniciar sesión.';
    }

    if (err.status === 413) {
      return 'Imagen demasiado grande (máx. 2 MB).';
    }

    const body = err.error;

    if (body?.mensaje) {
      return body.mensaje;
    }

    if (body?.message) {
      return body.message;
    }

    return fallback;
  }
}
