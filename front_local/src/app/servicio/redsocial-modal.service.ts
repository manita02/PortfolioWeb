import { Injectable } from '@angular/core';
import { AuthGuardService } from './auth-guard.service';
import { EntityFormModalService } from './entity-form-modal.service';

@Injectable({
  providedIn: 'root',
})
export class RedsocialModalService extends EntityFormModalService {
  constructor(authGuard: AuthGuardService) {
    super(authGuard);
  }
}
