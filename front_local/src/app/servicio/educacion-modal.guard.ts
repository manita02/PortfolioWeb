import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { EducacionModalService } from './educacion-modal.service';

@Injectable({
  providedIn: 'root',
})
export class EducacionCreateGuard implements CanActivate {
  constructor(
    private modal: EducacionModalService,
    private authGuard: AuthGuardService,
    private router: Router
  ) {}

  canActivate(): UrlTree {
    if (this.authGuard.ensureAdmin()) {
      this.modal.open('create');
    }
    return this.router.createUrlTree(['']);
  }
}

@Injectable({
  providedIn: 'root',
})
export class EducacionEditGuard implements CanActivate {
  constructor(
    private modal: EducacionModalService,
    private authGuard: AuthGuardService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): UrlTree {
    if (this.authGuard.ensureAdmin()) {
      const id = Number(route.paramMap.get('id'));
      if (!Number.isNaN(id) && id > 0) {
        this.modal.open('edit', id);
      }
    }
    return this.router.createUrlTree(['']);
  }
}
