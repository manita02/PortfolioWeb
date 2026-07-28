import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Organizacion } from 'src/app/modelo/organizacion';
import { ModalLoadingService } from 'src/app/servicio/modal-loading.service';
import { OrganizacionModalService } from 'src/app/servicio/organizacion-modal.service';
import { OrganizacionService } from 'src/app/servicio/organizacion.service';

@Component({
  selector: 'app-organizacion-form-modal',
  templateUrl: './organizacion-form-modal.component.html',
  styleUrls: ['./organizacion-form-modal.component.css'],
})
export class OrganizacionFormModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  organizaciones: Organizacion[] = [];
  form: Organizacion | null = null;
  editingId: number | null = null;

  loading = false;
  guardando = false;
  eliminandoId: number | null = null;
  errorMessage = '';

  private modalSub?: Subscription;
  private loadSub?: Subscription;

  constructor(
    private modal: OrganizacionModalService,
    private modalLoading: ModalLoadingService,
    private organizacionS: OrganizacionService
  ) {}

  ngOnInit(): void {
    this.modalSub = this.modal.state$.subscribe(state => {
      this.isOpen = state.open;
      this.loadSub?.unsubscribe();

      if (state.open) {
        this.errorMessage = '';
        this.editingId = null;
        this.loadSub = this.modalLoading.runLoad(
          this,
          this.organizacionS.lista(),
          data => {
            this.organizaciones = data;
            this.initCreateForm();
          },
          'No se pudieron cargar las organizaciones.'
        );
      } else {
        this.form = null;
        this.organizaciones = [];
        this.editingId = null;
        this.loading = false;
        this.guardando = false;
        this.eliminandoId = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
    this.loadSub?.unsubscribe();
  }

  get isEdit(): boolean {
    return this.editingId != null;
  }

  get submitLabel(): string {
    return this.isEdit ? 'Guardar cambios' : 'Agregar organización';
  }

  get formValido(): boolean {
    return !!this.form?.nombre?.trim();
  }

  get isBusy(): boolean {
    return this.loading || this.guardando || this.eliminandoId != null;
  }

  isSelected(org: Organizacion): boolean {
    return this.editingId != null && org.id === this.editingId;
  }

  isDeleting(org: Organizacion): boolean {
    return org.id != null && this.eliminandoId === org.id;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent): void {
    if (this.isOpen && !this.isBusy) {
      event.stopPropagation();
      this.close();
    }
  }

  close(): void {
    if (this.isBusy) {
      return;
    }
    this.modal.close();
  }

  selectOrg(org: Organizacion): void {
    if (this.isBusy || org.id == null) {
      return;
    }
    this.errorMessage = '';
    this.editingId = org.id;
    this.form = {
      nombre: org.nombre,
      ubicacion: org.ubicacion ?? '',
      urlWeb: org.urlWeb ?? '',
      logoImg: org.logoImg ?? '',
    };
  }

  startCreate(): void {
    if (this.isBusy) {
      return;
    }
    this.errorMessage = '';
    this.editingId = null;
    this.initCreateForm();
  }

  onEdit(org: Organizacion, event: Event): void {
    event.stopPropagation();
    this.selectOrg(org);
  }

  onDelete(org: Organizacion, event: Event): void {
    event.stopPropagation();
    if (this.isBusy || org.id == null) {
      return;
    }

    if (
      !confirm(
        `¿Eliminar la organización "${org.nombre}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    this.errorMessage = '';
    this.eliminandoId = org.id;

    this.organizacionS.delete(org.id).subscribe({
      next: () => {
        this.eliminandoId = null;
        if (this.editingId === org.id) {
          this.startCreate();
        }
        this.reloadList();
        this.modal.notifySaved({ action: 'delete', deletedId: org.id });
      },
      error: err => {
        this.eliminandoId = null;
        this.errorMessage =
          err?.error?.mensaje ||
          err?.error?.message ||
          'No se pudo eliminar. Verificá que estés logueado como admin.';
      },
    });
  }

  onSubmit(form: NgForm): void {
    if (!this.form || !this.formValido || this.guardando) {
      return;
    }

    if (this.isEdit && !confirm('¿Guardar los cambios en esta organización?')) {
      return;
    }

    this.guardando = true;
    this.errorMessage = '';

    const payload: Organizacion = {
      nombre: this.form.nombre.trim(),
      ubicacion: this.form.ubicacion?.trim() || null,
      urlWeb: this.form.urlWeb?.trim() || null,
      logoImg: this.form.logoImg || null,
    };

    const request$ = this.isEdit
      ? this.organizacionS.update(this.editingId!, payload)
      : this.organizacionS.save(payload);

    request$.subscribe({
      next: saved => {
        this.guardando = false;
        const id = saved.id ?? this.editingId ?? undefined;
        this.modal.notifySaved({
          action: this.isEdit ? 'update' : 'create',
          id,
        });
        this.reloadList(() => {
          if (id != null) {
            const updated = this.organizaciones.find(o => o.id === id);
            if (updated) {
              this.selectOrg(updated);
            } else {
              this.startCreate();
            }
          } else {
            this.startCreate();
          }
        });
      },
      error: err => {
        this.guardando = false;
        this.errorMessage =
          err?.error?.mensaje ||
          err?.error?.message ||
          'Verificá los campos y que estés logueado como admin.';
      },
    });
  }

  private initCreateForm(): void {
    this.form = {
      nombre: '',
      ubicacion: '',
      urlWeb: '',
      logoImg: '',
    };
  }

  private reloadList(onDone?: () => void): void {
    this.organizacionS.lista().subscribe({
      next: data => {
        this.organizaciones = data;
        onDone?.();
      },
      error: () => {
        this.errorMessage = 'No se pudo actualizar la lista de organizaciones.';
      },
    });
  }
}
