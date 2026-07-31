import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { toDataUri } from '../../util/archivo.util';

/**
 * Modal maximizado para ver imágenes (educación / proyectos).
 * Inputs: open, src, title
 * Output: closed
 */
@Component({
  selector: 'app-image-viewer-modal',
  templateUrl: './image-viewer-modal.component.html',
  styleUrls: ['./image-viewer-modal.component.css'],
})
export class ImageViewerModalComponent implements OnChanges {
  @Input() open = false;
  @Input() src: string | null = null;
  @Input() title = 'Imagen';
  @Output() closed = new EventEmitter<void>();

  displaySrc: string | null = null;
  loadError = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] || changes['src']) {
      if (this.open && this.src) {
        this.displaySrc = this.resolveSrc(this.src);
        this.loadError = !this.displaySrc;
      } else if (!this.open) {
        this.displaySrc = null;
        this.loadError = false;
      }
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event): void {
    if (!this.open) {
      return;
    }
    event.preventDefault();
    this.close();
  }

  close(): void {
    this.displaySrc = null;
    this.loadError = false;
    this.closed.emit();
  }

  onImgError(): void {
    this.loadError = true;
  }

  private resolveSrc(src: string): string | null {
    const trimmed = src.trim();
    if (!trimmed) {
      return null;
    }
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('data:')
    ) {
      return trimmed;
    }
    return toDataUri(trimmed, 'image/png');
  }
}
