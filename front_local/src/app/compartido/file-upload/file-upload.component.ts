import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  readFileAsDataUri,
  toPdfDataUri,
  validateImageFile,
  validatePdfFile
} from '../../util/archivo.util';

/**
 * Carga de archivo imagen o PDF. Compatible con [(value)].
 * Inputs: mode, label, required, value
 * Outputs: valueChange, error
 */
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  @Input() mode: 'image' | 'pdf' = 'image';
  @Input() label = 'Archivo';
  @Input() required = false;
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() error = new EventEmitter<string | null>();

  validationError: string | null = null;
  fileName = '';
  fileSizeLabel = '';

  get acceptTypes(): string {
    return this.mode === 'pdf' ? 'application/pdf' : 'image/png,image/jpeg,image/jpg';
  }

  get pdfDataUri(): string | null {
    return this.mode === 'pdf' ? toPdfDataUri(this.value) : null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const err = this.mode === 'pdf' ? validatePdfFile(file) : validateImageFile(file);
    if (err) {
      this.validationError = err;
      this.error.emit(err);
      input.value = '';
      return;
    }

    this.fileName = file.name;
    this.fileSizeLabel = this.formatSize(file.size);

    readFileAsDataUri(file).then(dataUri => {
      this.validationError = null;
      this.error.emit(null);
      this.value = dataUri;
      this.valueChange.emit(dataUri);
    }).catch(() => {
      this.validationError = 'No se pudo leer el archivo.';
      this.error.emit(this.validationError);
    });
  }

  clearFile(): void {
    this.validationError = null;
    this.error.emit(null);
    this.value = '';
    this.fileName = '';
    this.fileSizeLabel = '';
    this.valueChange.emit('');
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
