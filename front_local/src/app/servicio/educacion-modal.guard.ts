import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { EducacionModalService } from './educacion-modal.service';

@Injectable({
  providedIn: 'root',
})
export class EducacionCreateGuard implements CanActivate {
  constructor(
    private modal: EducacionModalService,
    private router: Router
  ) {}

  canActivate(): UrlTree {
    this.modal.open('create');
    return this.router.createUrlTree(['']);
  }
}

@Injectable({
  providedIn: 'root',
})
export class EducacionEditGuard implements CanActivate {
  constructor(
    private modal: EducacionModalService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): UrlTree {
    const id = Number(route.paramMap.get('id'));
    if (!Number.isNaN(id) && id > 0) {
      this.modal.open('edit', id);
    }
    return this.router.createUrlTree(['']);
  }
}
