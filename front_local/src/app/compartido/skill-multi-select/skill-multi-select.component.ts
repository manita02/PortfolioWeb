import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { HabilidadDto } from '../../modelo/habilidad.dto';

export interface SkillGroup {
  nombre: string;
  habilidades: HabilidadDto[];
}

/**
 * Multi-select de habilidades con checkboxes.
 * Inputs: options, selectedIds
 * Output: selectedIdsChange
 */
@Component({
  selector: 'app-skill-multi-select',
  templateUrl: './skill-multi-select.component.html',
  styleUrls: ['./skill-multi-select.component.css']
})
export class SkillMultiSelectComponent implements OnChanges {
  @Input() options: HabilidadDto[] = [];
  @Input() selectedIds: number[] = [];
  @Output() selectedIdsChange = new EventEmitter<number[]>();

  groups: SkillGroup[] = [];

  ngOnChanges(): void {
    const map = new Map<string, HabilidadDto[]>();
    for (const h of this.options) {
      const key = h.tipoHabilidad?.nombre ?? 'Sin categoría';
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(h);
    }
    this.groups = Array.from(map.entries()).map(([nombre, habilidades]) => ({
      nombre,
      habilidades
    }));
  }

  isSelected(id: number | undefined): boolean {
    return id != null && this.selectedIds.includes(id);
  }

  toggle(id: number | undefined, checked: boolean): void {
    if (id == null) {
      return;
    }
    let next: number[];
    if (checked) {
      next = this.selectedIds.includes(id) ? this.selectedIds : [...this.selectedIds, id];
    } else {
      next = this.selectedIds.filter(x => x !== id);
    }
    this.selectedIds = next;
    this.selectedIdsChange.emit(next);
  }
}
