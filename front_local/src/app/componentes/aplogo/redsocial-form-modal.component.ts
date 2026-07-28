import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import { Redsocial } from 'src/app/modelo/redsocial';
import { ModalLoadingService } from 'src/app/servicio/modal-loading.service';
import { runFormModalOpenLoad } from 'src/app/servicio/form-modal-load.helper';
import { FormModalMode } from 'src/app/servicio/form-modal.types';
import { RedsocialModalService } from 'src/app/servicio/redsocial-modal.service';
import { RedsocialService } from 'src/app/servicio/redsocial.service';

@Component({
  selector: 'app-redsocial-form-modal',
  templateUrl: './redsocial-form-modal.component.html',
  styleUrls: ['./redsocial-form-modal.component.css'],
})
export class RedsocialFormModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  mode: FormModalMode = 'create';
  entityId?: number;
  redsocial: Redsocial | null = null;

  loading = false;
  guardando = false;
  errorMessage = '';

  private modalSub?: Subscription;
  private loadSub?: Subscription;

  constructor(
    private modal: RedsocialModalService,
    private modalLoading: ModalLoadingService,
    private redsocialS: RedsocialService
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
        this.redsocial = null;
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
    return this.isEdit ? 'Editar red social' : 'Agregar red social';
  }

  get submitLabel(): string {
    return this.isEdit ? 'Guardar cambios' : 'Agregar red social';
  }

  get formValido(): boolean {
    if (!this.redsocial) {
      return false;
    }

    return !!(
      this.redsocial.nombreRedS?.trim() &&
      this.redsocial.link?.trim() &&
      this.redsocial.img?.trim()
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
    if (!this.redsocial || !this.formValido || this.guardando) {
      return;
    }

    if (this.isEdit && !confirm('¿Está seguro que desea guardar los cambios?')) {
      return;
    }

    this.guardando = true;
    this.errorMessage = '';

    const payload: Redsocial = {
      nombreRedS: this.redsocial.nombreRedS.trim(),
      link: this.redsocial.link.trim(),
      img: this.redsocial.img.trim(),
    };

    const request$ = this.isEdit
      ? this.redsocialS.update(this.entityId!, payload)
      : this.redsocialS.save(payload);

    request$.subscribe({
      next: () => this.modal.notifySaved(),
      error: err => {
        this.guardando = false;
        this.errorMessage =
          err?.error?.mensaje ||
          err?.error?.message ||
          'Verifique nombre, URL, ícono y que esté logueado.';
      },
    });
  }

  private openForm(): void {
    this.loadSub = runFormModalOpenLoad<Redsocial>({
      host: this,
      modalLoading: this.modalLoading,
      mode: this.mode,
      entityId: this.entityId,
      clearEntity: () => {
        this.redsocial = null;
      },
      getCatalogs$: () => of(null),
      loadEntity$: id => this.redsocialS.detail(id),
      onCreateReady: () => this.initCreateForm(),
      onEditReady: data => {
        this.redsocial = {
          ...data,
          img: data.img ?? '',
        };
      },
      createErrorMessage: 'No se pudo preparar el formulario.',
      editErrorMessage: 'No se pudo cargar la red social o la sesión expiró.',
    });
  }

  private initCreateForm(): void {
    this.redsocial = {
      nombreRedS: '',
      link: '',
      img: '',
    };
  }
}
