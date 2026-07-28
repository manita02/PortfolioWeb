import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface OrganizacionModalState {
  open: boolean;
}

export interface OrganizacionSavedEvent {
  action: 'create' | 'update' | 'delete';
  id?: number;
  deletedId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrganizacionModalService {
  private readonly stateSubject = new BehaviorSubject<OrganizacionModalState>({
    open: false,
  });

  private readonly savedSubject = new Subject<OrganizacionSavedEvent>();

  readonly state$ = this.stateSubject.asObservable();
  readonly saved$ = this.savedSubject.asObservable();

  open(): void {
    this.stateSubject.next({ open: true });
  }

  close(): void {
    this.stateSubject.next({ open: false });
  }

  notifySaved(event: OrganizacionSavedEvent): void {
    this.savedSubject.next(event);
  }

  get state(): OrganizacionModalState {
    return this.stateSubject.value;
  }
}
