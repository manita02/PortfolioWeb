import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authGuard: AuthGuardService) {}

  canActivate(): boolean | UrlTree {
    if (this.authGuard.ensureAdmin()) {
      return true;
    }
    return this.authGuard.redirectHome();
  }
}
