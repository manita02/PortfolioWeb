import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AlertDialogService,
  AlertDialogState,
  AlertDialogVariant,
} from 'src/app/servicio/alert-dialog.service';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css'],
})
export class AlertDialogComponent implements OnInit, OnDestroy {
  state: AlertDialogState | null = null;
  private sub?: Subscription;

  constructor(private alertDialog: AlertDialogService) {}

  ngOnInit(): void {
    this.sub = this.alertDialog.state$.subscribe(state => {
      this.state = state;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.state) {
      return;
    }
    this.cancel();
  }

  confirm(): void {
    this.alertDialog.resolve(true);
  }

  cancel(): void {
    this.alertDialog.resolve(false);
  }

  iconFor(variant: AlertDialogVariant): string {
    switch (variant) {
      case 'danger':
        return 'bi-exclamation-triangle';
      case 'warning':
        return 'bi-question-circle';
      case 'success':
        return 'bi-check-circle';
      default:
        return 'bi-info-circle';
    }
  }

  confirmBtnClass(variant: AlertDialogVariant): string {
    return variant === 'danger' ? 'btn-pf--delete' : 'btn-pf--view';
  }
}
