/** Formatea un período para visualización. Ej: "2020 – 2024", "2022 – Actualidad". */
export function formatPeriodo(
  fechaInicio: string,
  fechaFin?: string | null,
  esActual?: boolean
): string {
  if (!fechaInicio) {
    return '';
  }
  if (esActual) {
    return `${fechaInicio} – Actualidad`;
  }
  if (fechaFin) {
    return `${fechaInicio} – ${fechaFin}`;
  }
  return fechaInicio;
}

/** Si es actual, fechaFin debe ser null; si no, conserva el valor. */
export function parseEsActual(
  fechaFin: string | null | undefined,
  esActual: boolean
): string | null {
  if (esActual) {
    return null;
  }
  return fechaFin ?? null;
}
