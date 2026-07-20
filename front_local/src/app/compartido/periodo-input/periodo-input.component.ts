import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formatPeriodo, parseEsActual } from '../../util/periodo.util';

/**
 * Inputs de período (fechaInicio, fechaFin, esActual) para formularios.
 * Outputs: fechaInicioChange, fechaFinChange, esActualChange
 */
@Component({
  selector: 'app-periodo-input',
  templateUrl: './periodo-input.component.html',
  styleUrls: ['./periodo-input.component.css']
})
export class PeriodoInputComponent {
  @Input() fechaInicio = '';
  @Input() fechaFin: string | null = '';
  @Input() esActual = false;
  @Input() showEsActual = true;
  @Input() required = false;
  @Input() placeholder = 'MM/yyyy';
  /** Muestra la línea "Vista previa: …" debajo de los campos. */
  @Input() showPreview = true;
  checkboxId = `esActualCheck-${Math.random().toString(36).slice(2, 9)}`;

  @Output() fechaInicioChange = new EventEmitter<string>();
  @Output() fechaFinChange = new EventEmitter<string | null>();
  @Output() esActualChange = new EventEmitter<boolean>();

  get preview(): string {
    return formatPeriodo(this.fechaInicio, this.fechaFin, this.esActual);
  }

  onFechaInicioChange(value: string): void {
    this.fechaInicio = value;
    this.fechaInicioChange.emit(value);
  }

  onFechaFinChange(value: string): void {
    this.fechaFin = value;
    this.fechaFinChange.emit(parseEsActual(value, this.esActual));
  }

  onEsActualChange(checked: boolean): void {
    this.esActual = checked;
    this.esActualChange.emit(checked);
    if (checked) {
      this.fechaFin = null;
      this.fechaFinChange.emit(null);
    }
  }
}
