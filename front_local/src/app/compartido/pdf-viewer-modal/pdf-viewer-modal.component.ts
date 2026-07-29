import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { pdfToObjectUrl } from '../../util/archivo.util';

/**
 * Modal responsive para visualizar un PDF (base64 / data URI).
 * Inputs: open, src, title, fileName
 * Output: closed
 */
@Component({
  selector: 'app-pdf-viewer-modal',
  templateUrl: './pdf-viewer-modal.component.html',
  styleUrls: ['./pdf-viewer-modal.component.css'],
})
export class PdfViewerModalComponent implements OnChanges, OnDestroy {
  @Input() open = false;
  @Input() src: string | null = null;
  @Input() title = 'Certificado';
  @Input() fileName = 'certificado.pdf';
  @Output() closed = new EventEmitter<void>();

  safeUrl: SafeResourceUrl | null = null;
  private objectUrl: string | null = null;
  loadError = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] || changes['src']) {
      if (this.open && this.src) {
        this.buildUrl(this.src);
      } else if (!this.open) {
        this.revokeUrl();
      }
    }
  }

  ngOnDestroy(): void {
    this.revokeUrl();
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
    this.revokeUrl();
    this.closed.emit();
  }

  download(): void {
    if (!this.objectUrl) {
      return;
    }
    const link = document.createElement('a');
    link.href = this.objectUrl;
    link.download = this.fileName || 'certificado.pdf';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  openInNewTab(): void {
    if (!this.objectUrl) {
      return;
    }
    window.open(this.withPdfStartView(this.objectUrl), '_blank', 'noopener,noreferrer');
  }

  private buildUrl(src: string): void {
    this.revokeUrl();
    this.loadError = false;
    const url = pdfToObjectUrl(src);
    if (!url) {
      this.loadError = true;
      this.safeUrl = null;
      return;
    }
    this.objectUrl = url;
    /* page=1 + FitH: arranca en el tope de la primera hoja */
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.withPdfStartView(url)
    );
  }

  private withPdfStartView(url: string): string {
    return `${url}#page=1&view=FitH&pagemode=none`;
  }

  private revokeUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
    this.safeUrl = null;
  }
}
