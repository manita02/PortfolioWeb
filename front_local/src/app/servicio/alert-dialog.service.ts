import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AlertDialogVariant = 'info' | 'danger' | 'warning' | 'success';
export type AlertDialogMode = 'alert' | 'confirm';

export interface AlertDialogState {
  mode: AlertDialogMode;
  variant: AlertDialogVariant;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
}

export interface AlertDialogOptions {
  title?: string;
  variant?: AlertDialogVariant;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlertDialogService {
  private readonly stateSubject = new BehaviorSubject<AlertDialogState | null>(null);
  readonly state$ = this.stateSubject.asObservable();

  private resolver: ((value: boolean) => void) | null = null;

  get isOpen(): boolean {
    return this.stateSubject.value != null;
  }

  /** Aviso con un solo botón (reemplazo de `alert`). */
  alert(message: string, options: AlertDialogOptions = {}): Promise<void> {
    return this.open({
      mode: 'alert',
      message,
      variant: options.variant ?? 'info',
      title: options.title ?? this.defaultTitle(options.variant ?? 'info', 'alert'),
      confirmLabel: options.confirmLabel ?? 'Entendido',
      cancelLabel: options.cancelLabel ?? 'Cancelar',
    }).then(() => undefined);
  }

  /** Confirmación Cancelar / Aceptar (reemplazo de `confirm`). */
  confirm(message: string, options: AlertDialogOptions = {}): Promise<boolean> {
    const variant = options.variant ?? 'warning';
    return this.open({
      mode: 'confirm',
      message,
      variant,
      title: options.title ?? this.defaultTitle(variant, 'confirm'),
      confirmLabel: options.confirmLabel ?? (variant === 'danger' ? 'Eliminar' : 'Confirmar'),
      cancelLabel: options.cancelLabel ?? 'Cancelar',
    });
  }

  resolve(result: boolean): void {
    const resolve = this.resolver;
    this.resolver = null;
    this.stateSubject.next(null);
    document.body.classList.remove('alert-dialog-open');
    resolve?.(result);
  }

  private open(state: AlertDialogState): Promise<boolean> {
    if (this.resolver) {
      this.resolver(false);
      this.resolver = null;
    }

    this.stateSubject.next(state);
    document.body.classList.add('alert-dialog-open');

    return new Promise<boolean>(resolve => {
      this.resolver = resolve;
    });
  }

  private defaultTitle(variant: AlertDialogVariant, mode: AlertDialogMode): string {
    if (mode === 'confirm') {
      return variant === 'danger' ? 'Confirmar eliminación' : 'Confirmar acción';
    }
    switch (variant) {
      case 'danger':
        return 'Error';
      case 'warning':
        return 'Atención';
      case 'success':
        return 'Listo';
      default:
        return 'Aviso';
    }
  }
}
