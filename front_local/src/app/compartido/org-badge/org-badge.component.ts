import { Component, Input } from '@angular/core';
import { Organizacion } from '../../modelo/organizacion';

/**
 * Badge de organización con logo, nombre y ubicación (solo lectura).
 * Inputs: organizacion, showLink, size
 */
@Component({
  selector: 'app-org-badge',
  templateUrl: './org-badge.component.html',
})
export class OrgBadgeComponent {
  @Input() organizacion: Organizacion | null = null;
  @Input() showLink = true;
  @Input() size: 'sm' | 'md' = 'md';

  get logoHeight(): string {
    return this.size === 'sm' ? '24px' : '40px';
  }
}
