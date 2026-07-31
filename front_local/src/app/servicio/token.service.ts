import { Injectable } from '@angular/core';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUsername';
const AUTHORITIES_KEY = 'AuthAuthorities';
const ADMIN_ROLE = 'ROLE_ADMIN';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  roles: Array<string> = [];

  public setToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public setUserName(userName: string): void {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, userName);
  }

  public getUserName(): string | null {
    return sessionStorage.getItem(USERNAME_KEY);
  }

  public setAuthorities(authorities: string[]): void {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    this.roles = [];
    const stored = sessionStorage.getItem(AUTHORITIES_KEY);
    if (stored) {
      JSON.parse(stored).forEach((authority: { authority: string }) => {
        this.roles.push(authority.authority);
      });
    }
    return this.roles;
  }

  public isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) {
        return false;
      }
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  public isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  public isAdmin(): boolean {
    return this.isLoggedIn() && this.getAuthorities().includes(ADMIN_ROLE);
  }

  public logOut(): void {
    window.sessionStorage.clear();
  }
}
