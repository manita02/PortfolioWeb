import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { LoginModalService } from './login-modal.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    private tokenService: TokenService,
    private loginModal: LoginModalService,
    private router: Router
  ) {}

  isAdmin(): boolean {
    return this.tokenService.isAdmin();
  }

  /** Abre login si no hay sesión válida; devuelve true solo si el usuario es admin. */
  ensureAdmin(): boolean {
    if (this.tokenService.isAdmin()) {
      return true;
    }
    if (!this.tokenService.isLoggedIn()) {
      this.loginModal.open();
    }
    return false;
  }

  redirectHome(): UrlTree {
    return this.router.createUrlTree(['']);
  }
}
