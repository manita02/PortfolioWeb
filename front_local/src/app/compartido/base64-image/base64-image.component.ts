import { Component, Input, OnChanges } from '@angular/core';
import { toDataUri } from '../../util/archivo.util';

/**
 * Muestra una imagen desde base64 puro o data URI.
 * Inputs: src, alt, mime, cssClass, maxHeight
 */
@Component({
  selector: 'app-base64-image',
  templateUrl: './base64-image.component.html',
  styleUrls: ['./base64-image.component.css']
})
export class Base64ImageComponent implements OnChanges {
  @Input() src: string | null = null;
  @Input() alt = '';
  @Input() mime = 'image/png';
  @Input() cssClass = '';
  @Input() maxHeight = '120px';

  displaySrc: string | null = null;

  ngOnChanges(): void {
    this.displaySrc = toDataUri(this.src, this.mime);
  }
}
