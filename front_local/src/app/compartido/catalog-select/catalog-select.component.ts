import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TipoCatalogo } from '../../modelo/tipo-catalogo';

/**
 * Select genérico para catálogos { id, nombre }.
 * Inputs: label, options, selectedId, required, placeholder
 * Output: selectedIdChange
 */
@Component({
  selector: 'app-catalog-select',
  templateUrl: './catalog-select.component.html',
  styleUrls: ['./catalog-select.component.css']
})
export class CatalogSelectComponent {
  @Input() label = '';
  @Input() options: TipoCatalogo[] = [];
  @Input() selectedId: number | null = null;
  @Input() required = false;
  @Input() placeholder = 'Seleccionar...';

  @Output() selectedIdChange = new EventEmitter<number | null>();

  onChange(value: number | null): void {
    this.selectedId = value;
    this.selectedIdChange.emit(value);
  }
}
