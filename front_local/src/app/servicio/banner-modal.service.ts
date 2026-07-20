import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface BannerModalState {
  open: boolean;
  bannerId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class BannerModalService {
  private readonly stateSubject = new BehaviorSubject<BannerModalState>({
    open: false,
  });

  private readonly savedSubject = new Subject<void>();

  readonly state$ = this.stateSubject.asObservable();
  readonly saved$ = this.savedSubject.asObservable();

  openEdit(bannerId: number): void {
    this.stateSubject.next({ open: true, bannerId });
    document.body.classList.add('pf-modal-open');
  }

  close(): void {
    this.stateSubject.next({ open: false });
    document.body.classList.remove('pf-modal-open');
  }

  notifySaved(): void {
    this.savedSubject.next();
    this.close();
  }

  get state(): BannerModalState {
    return this.stateSubject.value;
  }
}
