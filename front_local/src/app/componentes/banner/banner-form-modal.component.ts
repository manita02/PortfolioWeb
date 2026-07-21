import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Banner } from 'src/app/modelo/banner';
import { BannerModalService } from 'src/app/servicio/banner-modal.service';
import { BannerService } from 'src/app/servicio/banner.service';
import { ModalLoadingService } from 'src/app/servicio/modal-loading.service';

@Component({
  selector: 'app-banner-form-modal',
  templateUrl: './banner-form-modal.component.html',
  styleUrls: ['./banner-form-modal.component.css'],
})
export class BannerFormModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  bannerId?: number;
  banner: Banner | null = null;

  loading = false;
  guardando = false;
  errorMessage = '';

  private modalSub?: Subscription;
  private loadSub?: Subscription;

  constructor(
    private modal: BannerModalService,
    private modalLoading: ModalLoadingService,
    private sBanner: BannerService
  ) {}

  ngOnInit(): void {
    this.modalSub = this.modal.state$.subscribe(state => {
      this.isOpen = state.open;
      this.bannerId = state.bannerId;

      this.loadSub?.unsubscribe();

      if (state.open && state.bannerId != null) {
        this.errorMessage = '';
        this.openEditModal(state.bannerId);
      } else {
        this.banner = null;
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

  get formValido(): boolean {
    return !!(
      this.banner?.titulo?.trim() &&
      this.banner?.img?.trim()
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
    if (!this.banner || !this.formValido || this.guardando || this.bannerId == null) {
      return;
    }

    if (!confirm('¿Está seguro que desea guardar los cambios?')) {
      return;
    }

    this.guardando = true;
    this.errorMessage = '';

    const payload: Banner = {
      titulo: this.banner.titulo.trim(),
      img: this.banner.img.trim(),
    };

    this.sBanner.update(this.bannerId, payload).subscribe({
      next: () => this.modal.notifySaved(),
      error: err => {
        this.guardando = false;
        this.errorMessage = this.mensajeError(err, 'No se pudo actualizar el banner.');
      },
    });
  }

  private openEditModal(id: number): void {
    this.banner = null;
    this.loadSub = this.modalLoading.runLoad(
      this,
      this.sBanner.detail(id),
      data => {
        this.banner = { ...data };
      },
      'No se pudo cargar el banner.'
    );
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
      return 'La imagen es demasiado grande para enviar al servidor. Elegí un archivo de menos de 750 KB en tu PC.';
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
