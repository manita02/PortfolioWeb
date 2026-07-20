import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginUsuario } from 'src/app/modelo/login-usuario';
import { AuthService } from 'src/app/servicio/auth.service';
import { LoginModalService } from 'src/app/servicio/login-modal.service';
import { TokenService } from 'src/app/servicio/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isOpen = false;
  isSubmitting = false;
  loginFailed = false;
  errorMessage = '';

  nombreUsuario = '';
  password = '';

  @ViewChild('usernameInput') usernameInput?: ElementRef<HTMLInputElement>;

  private modalSub?: Subscription;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private loginModal: LoginModalService
  ) {}

  ngOnInit(): void {
    this.modalSub = this.loginModal.isOpen$.subscribe(open => {
      this.isOpen = open;
      if (open) {
        this.resetForm();
        setTimeout(() => this.usernameInput?.nativeElement.focus(), 50);
      }
    });
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
    document.body.classList.remove('login-modal-open');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen && !this.isSubmitting) {
      this.close();
    }
  }

  close(): void {
    if (this.isSubmitting) {
      return;
    }
    this.loginModal.close();
  }

  onLogin(form: NgForm): void {
    if (form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.loginFailed = false;
    this.errorMessage = '';

    const loginUsuario = new LoginUsuario(this.nombreUsuario, this.password);

    this.authService.login(loginUsuario).subscribe({
      next: data => {
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        this.loginModal.close();
        window.location.reload();
      },
      error: err => {
        this.isSubmitting = false;
        this.loginFailed = true;
        this.errorMessage =
          err?.error?.mensaje ?? 'Usuario o contraseña incorrectos.';
        this.password = '';
        setTimeout(() => this.usernameInput?.nativeElement.focus(), 0);
      },
    });
  }

  private resetForm(): void {
    this.nombreUsuario = '';
    this.password = '';
    this.isSubmitting = false;
    this.loginFailed = false;
    this.errorMessage = '';
  }
}
