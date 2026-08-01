import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthGuardService } from './auth-guard.service';

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

  constructor(private authGuard: AuthGuardService) {}

  readonly state$ = this.stateSubject.asObservable();
  readonly saved$ = this.savedSubject.asObservable();

  open(): void {
    if (!this.authGuard.ensureAdmin()) {
      return;
    }
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
