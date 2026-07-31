import { BehaviorSubject, Subject } from 'rxjs';
import {
  CLOSED_FORM_MODAL_STATE,
  EntityFormModalState,
  FormModalMode,
} from './form-modal.types';
import { AuthGuardService } from './auth-guard.service';

/**
 * Estado y apertura/cierre compartidos para modales de formulario create/edit.
 * Cada sección extiende esta clase en su servicio de modal dedicado.
 */
export abstract class EntityFormModalService {
  protected readonly stateSubject = new BehaviorSubject<EntityFormModalState>(
    CLOSED_FORM_MODAL_STATE
  );

  protected readonly savedSubject = new Subject<void>();

  readonly state$ = this.stateSubject.asObservable();
  readonly saved$ = this.savedSubject.asObservable();

  protected constructor(protected authGuard: AuthGuardService) {}

  /** Punto único de apertura: create sin id, edit con id válido. */
  open(mode: FormModalMode, entityId?: number): void {
    if (!this.authGuard.ensureAdmin()) {
      return;
    }
    if (mode === 'edit') {
      if (entityId == null || entityId <= 0 || Number.isNaN(entityId)) {
        return;
      }
      this.stateSubject.next({ open: true, mode: 'edit', entityId });
    } else {
      this.stateSubject.next({ open: true, mode: 'create' });
    }
    document.body.classList.add('pf-modal-open');
  }

  close(): void {
    this.stateSubject.next(CLOSED_FORM_MODAL_STATE);
    document.body.classList.remove('pf-modal-open');
  }

  notifySaved(): void {
    this.savedSubject.next();
    this.close();
  }

  get state(): EntityFormModalState {
    return this.stateSubject.value;
  }
}
