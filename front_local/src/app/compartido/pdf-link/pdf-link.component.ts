import { Component, Input } from '@angular/core';
import { toPdfDataUri } from '../../util/archivo.util';

/**
 * Enlace para ver/descargar un PDF en base64 (solo lectura).
 * Inputs: base64, label
 */
@Component({
  selector: 'app-pdf-link',
  templateUrl: './pdf-link.component.html',
  styleUrls: ['./pdf-link.component.css']
})
export class PdfLinkComponent {
  @Input() base64: string | null = null;
  @Input() label = 'Ver certificado';

  get dataUri(): string | null {
    return toPdfDataUri(this.base64);
  }
}
