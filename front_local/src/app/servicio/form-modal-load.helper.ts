import { forkJoin, Observable, Subscription } from 'rxjs';
import { FormModalMode } from './form-modal.types';
import { ModalLoadingHost, ModalLoadingService } from './modal-loading.service';

export interface FormModalOpenLoadOptions<TEntity> {
  host: ModalLoadingHost;
  modalLoading: ModalLoadingService;
  mode: FormModalMode;
  entityId?: number;
  clearEntity: () => void;
  getCatalogs$: () => Observable<unknown>;
  loadEntity$: (id: number) => Observable<TEntity>;
  onCreateReady: () => void;
  onEditReady: (entity: TEntity) => void;
  createErrorMessage: string;
  editErrorMessage: string;
}

export function runFormModalOpenLoad<TEntity>(
  options: FormModalOpenLoadOptions<TEntity>
): Subscription {
  options.clearEntity();

  const load$ =
    options.mode === 'create'
      ? options.getCatalogs$()
      : forkJoin({
          catalogs: options.getCatalogs$(),
          entity: options.loadEntity$(options.entityId!),
        });

  return options.modalLoading.runLoad(
    options.host,
    load$,
    result => {
      if (options.mode === 'create') {
        options.onCreateReady();
        return;
      }
      const { entity } = result as { entity: TEntity };
      options.onEditReady(entity);
    },
    options.mode === 'create'
      ? options.createErrorMessage
      : options.editErrorMessage
  );
}
