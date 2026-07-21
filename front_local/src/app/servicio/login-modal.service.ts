import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginModalService {
  private readonly openSubject = new BehaviorSubject<boolean>(false);
  readonly isOpen$ = this.openSubject.asObservable();

  open(): void {
    this.openSubject.next(true);
    document.body.classList.add('login-modal-open');
  }

  close(): void {
    this.openSubject.next(false);
    document.body.classList.remove('login-modal-open');
  }

  get isOpen(): boolean {
    return this.openSubject.value;
  }
}
