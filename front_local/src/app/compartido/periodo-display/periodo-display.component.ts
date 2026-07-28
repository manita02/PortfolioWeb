import { Component, Input } from '@angular/core';
import { formatDuracion, formatPeriodoRango } from '../../util/periodo.util';

/** Muestra un período formateado (fechas + duración debajo). */
@Component({
  selector: 'app-periodo-display',
  templateUrl: './periodo-display.component.html',
})
export class PeriodoDisplayComponent {
  @Input() fechaInicio = '';
  @Input() fechaFin: string | null = null;
  @Input() esActual = false;

  get rango(): string {
    return formatPeriodoRango(this.fechaInicio, this.fechaFin, this.esActual);
  }

  get duracion(): string {
    if (!this.esActual && !this.fechaFin) {
      return '';
    }
    return formatDuracion(this.fechaInicio, this.fechaFin, this.esActual);
  }

  get texto(): string {
    if (!this.rango) {
      return '';
    }
    return this.duracion ? `${this.rango}\n${this.duracion}` : this.rango;
  }
}
