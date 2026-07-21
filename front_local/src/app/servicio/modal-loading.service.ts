import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

export interface ModalLoadingHost {
  loading: boolean;
  errorMessage?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModalLoadingService {
  showLoading(host: ModalLoadingHost): void {
    host.loading = true;
  }

  hideLoading(host: ModalLoadingHost): void {
    host.loading = false;
  }

  runLoad<T>(
    host: ModalLoadingHost,
    load$: Observable<T>,
    onSuccess: (result: T) => void,
    errorMessage: string
  ): Subscription {
    this.showLoading(host);

    return load$
      .pipe(finalize(() => this.hideLoading(host)))
      .subscribe({
        next: result => onSuccess(result),
        error: () => {
          if (host.errorMessage !== undefined) {
            host.errorMessage = errorMessage;
          }
        },
      });
  }
}
