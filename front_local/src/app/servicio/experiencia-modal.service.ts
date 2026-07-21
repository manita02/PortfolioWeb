import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export type ExperienciaModalMode = 'create' | 'edit';

export interface ExperienciaModalState {
  open: boolean;
  mode: ExperienciaModalMode;
  experienciaId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExperienciaModalService {
  private readonly stateSubject = new BehaviorSubject<ExperienciaModalState>({
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

  openEdit(experienciaId: number): void {
    this.stateSubject.next({ open: true, mode: 'edit', experienciaId });
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

  get state(): ExperienciaModalState {
    return this.stateSubject.value;
  }
}
