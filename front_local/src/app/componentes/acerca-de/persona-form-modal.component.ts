import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Persona } from 'src/app/modelo/persona';
import { PersonaModalService } from 'src/app/servicio/persona-modal.service';
import { PersonaService } from 'src/app/servicio/persona.service';

@Component({
  selector: 'app-persona-form-modal',
  templateUrl: './persona-form-modal.component.html',
  styleUrls: ['./persona-form-modal.component.css'],
})
export class PersonaFormModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  personaId?: number;
  persona: Persona | null = null;

  loading = false;
  guardando = false;
  errorMessage = '';

  private modalSub?: Subscription;

  constructor(
    private modal: PersonaModalService,
    private personaS: PersonaService
  ) {}

  ngOnInit(): void {
    this.modalSub = this.modal.state$.subscribe(state => {
      this.isOpen = state.open;
      this.personaId = state.personaId;

      if (state.open && state.personaId != null) {
        this.errorMessage = '';
        this.loadPersona(state.personaId);
      } else {
        this.persona = null;
        this.loading = false;
        this.guardando = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
    document.body.classList.remove('pf-modal-open');
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

  onSubmit(form: NgForm): void {
    if (!this.persona || !this.formValido || this.guardando || this.personaId == null) {
      return;
    }

    if (!confirm('¿Está seguro que desea guardar los cambios?')) {
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

    this.personaS.update(this.personaId, payload).subscribe({
      next: () => this.modal.notifySaved(),
      error: err => {
        this.guardando = false;
        this.errorMessage = this.mensajeError(
          err,
          'No se pudo actualizar la información personal.'
        );
      },
    });
  }

  private loadPersona(id: number): void {
    this.loading = true;
    this.persona = null;

    this.personaS.detail(id).subscribe({
      next: data => {
        this.persona = { ...data };
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.errorMessage = this.mensajeError(
          err,
          'No se pudo cargar la información personal.'
        );
      },
    });
  }

  private mensajeError(err: unknown, fallback: string): string {
    if (!(err instanceof HttpErrorResponse)) {
      return fallback;
    }

    if (err.status === 0) {
      return 'No se pudo conectar con el servidor. Verificá que el backend esté en ejecución.';
    }

    if (err.status === 401) {
      return 'Sesión expirada. Volvé a iniciar sesión.';
    }

    if (err.status === 413) {
      return 'La imagen es demasiado grande para enviar al servidor. Elegí un archivo de menos de 2 MB.';
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
