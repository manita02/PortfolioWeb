import { Component, Input, OnChanges } from '@angular/core';
import { HabilidadDto } from '../../modelo/habilidad.dto';

/**
 * Badges de habilidades (solo lectura).
 * Inputs: habilidades, maxVisible
 */
@Component({
  selector: 'app-skill-chips',
  templateUrl: './skill-chips.component.html',
  styleUrls: ['./skill-chips.component.css']
})
export class SkillChipsComponent implements OnChanges {
  @Input() habilidades: HabilidadDto[] = [];
  @Input() maxVisible?: number;

  visible: HabilidadDto[] = [];
  hiddenCount = 0;

  ngOnChanges(): void {
    if (this.maxVisible != null && this.habilidades.length > this.maxVisible) {
      this.visible = this.habilidades.slice(0, this.maxVisible);
      this.hiddenCount = this.habilidades.length - this.maxVisible;
    } else {
      this.visible = this.habilidades;
      this.hiddenCount = 0;
    }
  }
}
