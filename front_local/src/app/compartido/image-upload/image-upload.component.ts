import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { readFileAsDataUri, validateImageFile } from '../../util/archivo.util';

/**
 * Carga de imagen con preview. Compatible con [(value)].
 * Inputs: label, required, maxSizeMb, value
 * Outputs: valueChange, error
 */
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnChanges {
  @Input() label = 'Imagen';
  @Input() required = false;
  /** Tamaño máximo en MB (se ignora si maxSizeKb está definido). */
  @Input() maxSizeMb = 2;
  /** Tamaño máximo en KB; prioridad sobre maxSizeMb. */
  @Input() maxSizeKb: number | null = null;
  /** Altura máxima del preview (se ignora si previewFullWidth es true). */
  @Input() previewMaxHeight = '150px';
  /** Preview a ancho completo con recorte tipo banner. */
  @Input() previewFullWidth = false;
  /** Botón de quitar como ícono con tooltip en lugar de texto. */
  @Input() iconClearButton = false;
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() error = new EventEmitter<string | null>();

  validationError: string | null = null;
  loading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && !changes['value'].firstChange) {
      this.validationError = null;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const maxBytes = this.maxSizeKb != null
      ? this.maxSizeKb * 1024
      : this.maxSizeMb * 1024 * 1024;
    const err = validateImageFile(file, maxBytes);

    if (err) {
      this.validationError = err;
      this.error.emit(err);
      input.value = '';
      return;
    }

    this.loading = true;
    readFileAsDataUri(file).then(dataUri => {
      this.validationError = null;
      this.error.emit(null);
      this.value = dataUri;
      this.valueChange.emit(dataUri);
    }).catch(() => {
      this.validationError = 'No se pudo leer el archivo.';
      this.error.emit(this.validationError);
    }).finally(() => {
      this.loading = false;
    });
  }

  clearImage(): void {
    this.validationError = null;
    this.error.emit(null);
    this.value = '';
    this.valueChange.emit('');
  }
}
