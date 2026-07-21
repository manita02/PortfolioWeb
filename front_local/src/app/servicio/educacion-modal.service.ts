import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export type EducacionModalMode = 'create' | 'edit';

export interface EducacionModalState {
  open: boolean;
  mode: EducacionModalMode;
  educacionId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class EducacionModalService {
  private readonly stateSubject = new BehaviorSubject<EducacionModalState>({
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

  openEdit(educacionId: number): void {
    this.stateSubject.next({ open: true, mode: 'edit', educacionId });
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

  get state(): EducacionModalState {
    return this.stateSubject.value;
  }
}
