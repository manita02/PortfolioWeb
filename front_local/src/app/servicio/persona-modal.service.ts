import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface PersonaModalState {
  open: boolean;
  personaId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PersonaModalService {
  private readonly stateSubject = new BehaviorSubject<PersonaModalState>({
    open: false,
  });

  private readonly savedSubject = new Subject<void>();

  readonly state$ = this.stateSubject.asObservable();
  readonly saved$ = this.savedSubject.asObservable();

  openEdit(personaId: number): void {
    this.stateSubject.next({ open: true, personaId });
    document.body.classList.add('pf-modal-open');
  }

  close(): void {
    this.stateSubject.next({ open: false });
    document.body.classList.remove('pf-modal-open');
  }

  notifySaved(): void {
    this.savedSubject.next();
    this.close();
  }

  get state(): PersonaModalState {
    return this.stateSubject.value;
  }
}
