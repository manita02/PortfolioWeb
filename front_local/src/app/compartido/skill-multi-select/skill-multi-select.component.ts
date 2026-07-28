import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { HabilidadDto } from '../../modelo/habilidad.dto';

export interface SkillGroup {
  nombre: string;
  tipoId: number;
  habilidades: HabilidadDto[];
}

/**
 * Grilla simple: columnas = tipos de habilidad, celdas = checkbox + nombre (multi-select).
 */
@Component({
  selector: 'app-skill-multi-select',
  templateUrl: './skill-multi-select.component.html',
  styleUrls: ['./skill-multi-select.component.css'],
})
export class SkillMultiSelectComponent implements OnChanges {
  @Input() options: HabilidadDto[] = [];
  @Input() selectedIds: number[] = [];
  @Output() selectedIdsChange = new EventEmitter<number[]>();

  groups: SkillGroup[] = [];
  rowIndexes: number[] = [];

  ngOnChanges(): void {
    const map = new Map<number, { nombre: string; habilidades: HabilidadDto[] }>();

    for (const h of this.options) {
      const tipoId = h.tipoHabilidad?.id ?? h.tipoHabilidadId ?? 0;
      const nombre =
        h.tipoHabilidad?.nombre?.trim() ||
        (tipoId > 0 ? `Tipo ${tipoId}` : 'Sin categoría');

      if (!map.has(tipoId)) {
        map.set(tipoId, { nombre, habilidades: [] });
      }
      map.get(tipoId)!.habilidades.push(h);
    }

    this.groups = Array.from(map.entries())
      .map(([tipoId, { nombre, habilidades }]) => ({
        nombre,
        tipoId,
        habilidades: [...habilidades].sort((a, b) =>
          a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
        ),
      }))
      .sort((a, b) => {
        if (a.tipoId === 0) {
          return 1;
        }
        if (b.tipoId === 0) {
          return -1;
        }
        return a.tipoId - b.tipoId || a.nombre.localeCompare(b.nombre, 'es');
      });

    const maxRows = this.groups.reduce(
      (max, g) => Math.max(max, g.habilidades.length),
      0
    );
    this.rowIndexes = Array.from({ length: maxRows }, (_, i) => i);
  }

  skillAt(group: SkillGroup, row: number): HabilidadDto | null {
    return group.habilidades[row] ?? null;
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

  trackByTipoId(_index: number, group: SkillGroup): number {
    return group.tipoId;
  }

  trackByRow(_index: number, row: number): number {
    return row;
  }

  trackBySkillId(_index: number, skill: HabilidadDto): number {
    return skill.id ?? _index;
  }
}
