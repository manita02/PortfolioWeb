import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';
import { BannerModalService } from './banner-modal.service';

@Injectable({
  providedIn: 'root',
})
export class BannerEditGuard implements CanActivate {
  constructor(
    private modal: BannerModalService,
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
