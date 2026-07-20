import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export type ProyectoModalMode = 'create' | 'edit';

export interface ProyectoModalState {
  open: boolean;
  mode: ProyectoModalMode;
  proyectoId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProyectoModalService {
  private readonly stateSubject = new BehaviorSubject<ProyectoModalState>({
    open: false,
    mode: 'create',
  });

  private readonly savedSubject = new Subject<void>();

  readonly state$ = this.stateSubject.asObservable();
  readonly saved$ = this.savedSubject.asObservable();

  openCreate(): void {
    this.stateSubject.next({ open: true, mode: 'create' });
    document.body.classList.add('pf-modal-open');
  }

  openEdit(proyectoId: number): void {
    this.stateSubject.next({ open: true, mode: 'edit', proyectoId });
    document.body.classList.add('pf-modal-open');
  }

  close(): void {
    this.stateSubject.next({ open: false, mode: 'create' });
    document.body.classList.remove('pf-modal-open');
  }

  notifySaved(): void {
    this.savedSubject.next();
    this.close();
  }

  get state(): ProyectoModalState {
    return this.stateSubject.value;
  }
}
