import { Component, Input } from '@angular/core';
import { formatPeriodo } from '../../util/periodo.util';

/** Muestra un período formateado en una línea (solo lectura). */
@Component({
  selector: 'app-periodo-display',
  templateUrl: './periodo-display.component.html',
  styleUrls: ['./periodo-display.component.css']
})
export class PeriodoDisplayComponent {
  @Input() fechaInicio = '';
  @Input() fechaFin: string | null = null;
  @Input() esActual = false;

  get texto(): string {
    return formatPeriodo(this.fechaInicio, this.fechaFin, this.esActual);
  }
}
