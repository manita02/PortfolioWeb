import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export type HabilidadModalMode = 'create' | 'edit';

export interface HabilidadModalState {
  open: boolean;
  mode: HabilidadModalMode;
  habilidadId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class HabilidadModalService {
  private readonly stateSubject = new BehaviorSubject<HabilidadModalState>({
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

  openEdit(habilidadId: number): void {
    this.stateSubject.next({ open: true, mode: 'edit', habilidadId });
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

  get state(): HabilidadModalState {
    return this.stateSubject.value;
  }
}
