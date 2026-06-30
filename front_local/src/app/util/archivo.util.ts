/** Límite absoluto del backend (2 MB en bytes reales). */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

/**
 * Límite seguro para banner en XAMPP/MySQL con max_allowed_packet = 1 MB (default).
 * Es el tamaño del archivo en el explorador de Windows, no el peso en base64.
 */
export const BANNER_MAX_IMAGE_BYTES = 750 * 1024;

const MAX_PDF_BYTES = 5 * 1024 * 1024;

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const PDF_TYPES = ['application/pdf'];

export function isDataUri(value: string): boolean {
  return value.trim().startsWith('data:') && value.includes(',');
}

export function stripDataUriPrefix(base64: string): string {
  if (!base64) {
    return '';
  }
  const trimmed = base64.trim();
  if (isDataUri(trimmed)) {
    return trimmed.substring(trimmed.indexOf(',') + 1);
  }
  return trimmed;
}

/** Convierte base64 puro (sin prefijo) a data URI listo para img src. */
export function toDataUri(
  base64: string | null | undefined,
  mime = 'image/png'
): string | null {
  if (!base64 || !base64.trim()) {
    return null;
  }
  const trimmed = base64.trim();
  if (isDataUri(trimmed)) {
    return trimmed;
  }
  return `data:${mime};base64,${trimmed}`;
}

export function readFileAsDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function formatSizeKb(bytes: number): string {
  return (bytes / 1024).toFixed(0);
}

export function validateImageFile(file: File, maxBytes = MAX_IMAGE_BYTES): string | null {
  if (!IMAGE_TYPES.includes(file.type)) {
    return 'Tipo de archivo no permitido. Se esperaba JPEG o PNG.';
  }
  if (file.size > maxBytes) {
    const fileKb = formatSizeKb(file.size);
    const maxKb = formatSizeKb(maxBytes);
    return `El archivo pesa ${fileKb} KB en tu PC; el máximo permitido es ${maxKb} KB (JPEG o PNG).`;
  }
  return null;
}

export function validatePdfFile(file: File): string | null {
  if (!PDF_TYPES.includes(file.type)) {
    return 'Tipo de archivo no permitido. Se esperaba PDF.';
  }
  if (file.size > MAX_PDF_BYTES) {
    return 'El archivo supera el límite de 5MB.';
  }
  return null;
}

/** Data URI para PDF a partir de base64 puro o con prefijo. */
export function toPdfDataUri(base64: string | null | undefined): string | null {
  return toDataUri(base64, 'application/pdf');
}
