import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { ProyectoModalService } from './proyecto-modal.service';

@Injectable({
  providedIn: 'root',
})
export class ProyectoCreateGuard implements CanActivate {
  constructor(
    private modal: ProyectoModalService,
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
export class ProyectoEditGuard implements CanActivate {
  constructor(
    private modal: ProyectoModalService,
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
