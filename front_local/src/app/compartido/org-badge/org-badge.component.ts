import { Component, Input } from '@angular/core';
import { Organizacion } from '../../modelo/organizacion';

/**
 * Badge de organización con logo, nombre y ubicación (solo lectura).
 * Inputs: organizacion, showLink, size, tipoUbicacion
 */
@Component({
  selector: 'app-org-badge',
  templateUrl: './org-badge.component.html',
})
export class OrgBadgeComponent {
  @Input() organizacion: Organizacion | null = null;
  @Input() showLink = true;
  @Input() size: 'sm' | 'md' = 'md';
  /** Si viene, se muestra junto a la ubicación: "Ciudad | 📍 Remoto". */
  @Input() tipoUbicacion: string | null = null;

  get showLocationRow(): boolean {
    return !!(this.organizacion?.ubicacion?.trim() || this.tipoUbicacion?.trim());
  }

  /** URL lista para abrir en nueva pestaña; null si no hay link. */
  get externalUrl(): string | null {
    if (!this.showLink) {
      return null;
    }
    const raw = this.organizacion?.urlWeb?.trim();
    if (!raw) {
      return null;
    }
    if (/^https?:\/\//i.test(raw)) {
      return raw;
    }
    if (raw.startsWith('//')) {
      return `https:${raw}`;
    }
    return `https://${raw}`;
  }
}
