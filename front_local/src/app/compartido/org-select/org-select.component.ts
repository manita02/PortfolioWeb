import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Organizacion } from '../../modelo/organizacion';

/**
 * Select de organización para formularios.
 * Inputs: organizaciones, selectedId, required, allowCreate
 * Outputs: selectedIdChange, createRequested
 */
@Component({
  selector: 'app-org-select',
  templateUrl: './org-select.component.html',
  styleUrls: ['./org-select.component.css']
})
export class OrgSelectComponent {
  @Input() organizaciones: Organizacion[] = [];
  @Input() selectedId: number | null = null;
  @Input() required = false;
  @Input() allowCreate = false;

  @Output() selectedIdChange = new EventEmitter<number | null>();
  @Output() createRequested = new EventEmitter<void>();

  onChange(value: number | null): void {
    this.selectedId = value;
    this.selectedIdChange.emit(value);
  }

  onCreate(): void {
    this.createRequested.emit();
  }
}
