import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { HabilidadModalService } from './habilidad-modal.service';

@Injectable({
  providedIn: 'root',
})
export class HabilidadCreateGuard implements CanActivate {
  constructor(
    private modal: HabilidadModalService,
    private router: Router
  ) {}

  canActivate(): UrlTree {
    this.modal.openCreate();
    return this.router.createUrlTree(['']);
  }
}

@Injectable({
  providedIn: 'root',
})
export class HabilidadEditGuard implements CanActivate {
  constructor(
    private modal: HabilidadModalService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): UrlTree {
    const id = Number(route.paramMap.get('id'));
    if (!Number.isNaN(id) && id > 0) {
      this.modal.openEdit(id);
    }
    return this.router.createUrlTree(['']);
  }
}
