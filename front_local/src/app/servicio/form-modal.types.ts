export type FormModalMode = 'create' | 'edit';

export interface EntityFormModalState {
  open: boolean;
  mode: FormModalMode;
  entityId?: number;
}

export const CLOSED_FORM_MODAL_STATE: EntityFormModalState = {
  open: false,
  mode: 'create',
};
