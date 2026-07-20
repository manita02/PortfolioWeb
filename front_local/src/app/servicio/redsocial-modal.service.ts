import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export type RedsocialModalMode = 'create' | 'edit';

export interface RedsocialModalState {
  open: boolean;
  mode: RedsocialModalMode;
  redsocialId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class RedsocialModalService {
  private readonly stateSubject = new BehaviorSubject<RedsocialModalState>({
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

  openEdit(redsocialId: number): void {
    this.stateSubject.next({ open: true, mode: 'edit', redsocialId });
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

  get state(): RedsocialModalState {
    return this.stateSubject.value;
  }
}
