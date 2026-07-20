import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { LoginModalService } from './login-modal.service';

@Injectable({
  providedIn: 'root',
})
export class LoginRedirectGuard implements CanActivate {
  constructor(
    private loginModal: LoginModalService,
    private router: Router
  ) {}

  canActivate(): UrlTree {
    this.loginModal.open();
    return this.router.createUrlTree(['']);
  }
}
