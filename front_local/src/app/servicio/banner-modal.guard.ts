import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { BannerModalService } from './banner-modal.service';

@Injectable({
  providedIn: 'root',
})
export class BannerEditGuard implements CanActivate {
  constructor(
    private modal: BannerModalService,
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
