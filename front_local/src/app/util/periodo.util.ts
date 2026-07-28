/** Formatea un período para visualización (fechas + duración). */
export function formatPeriodo(
  fechaInicio: string,
  fechaFin?: string | null,
  esActual?: boolean
): string {
  const rango = formatPeriodoRango(fechaInicio, fechaFin, esActual);
  if (!rango) {
    return '';
  }

  if (!esActual && !fechaFin) {
    return rango;
  }

  const duracion = formatDuracion(fechaInicio, fechaFin, esActual);
  return duracion ? `${rango} · ${duracion}` : rango;
}

/** Solo el rango de fechas. Ej: "02/2024 – Actualidad". */
export function formatPeriodoRango(
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

/**
 * Duración estilo LinkedIn en español.
 * Ej: "2 años y 6 meses", "1 año", "8 meses".
 */
export function formatDuracion(
  fechaInicio: string,
  fechaFin?: string | null,
  esActual?: boolean
): string {
  const totalMeses = calcDuracionMeses(fechaInicio, fechaFin, esActual);
  if (totalMeses == null || totalMeses <= 0) {
    return '';
  }

  const anios = Math.floor(totalMeses / 12);
  const meses = totalMeses % 12;
  const partes: string[] = [];

  if (anios === 1) {
    partes.push('1 año');
  } else if (anios > 1) {
    partes.push(`${anios} años`);
  }

  if (meses === 1) {
    partes.push('1 mes');
  } else if (meses > 1) {
    partes.push(`${meses} meses`);
  }

  return partes.join(' y ');
}

/** Meses totales entre inicio y fin (ambos inclusive, como LinkedIn). */
export function calcDuracionMeses(
  fechaInicio: string,
  fechaFin?: string | null,
  esActual?: boolean
): number | null {
  const start = parsePeriodoFecha(fechaInicio);
  if (!start) {
    return null;
  }

  let end: { year: number; month: number } | null = null;

  if (esActual) {
    const now = new Date();
    end = { year: now.getFullYear(), month: now.getMonth() + 1 };
  } else if (fechaFin) {
    end = parsePeriodoFecha(fechaFin);
  }

  if (!end) {
    return null;
  }

  const months =
    (end.year - start.year) * 12 + (end.month - start.month) + 1;

  return months > 0 ? months : null;
}

/** Parsea MM/yyyy, yyyy-MM, yyyy/MM o yyyy. */
export function parsePeriodoFecha(
  value: string
): { year: number; month: number } | null {
  const v = (value || '').trim();
  if (!v) {
    return null;
  }

  let match = v.match(/^(\d{1,2})\/(\d{4})$/);
  if (match) {
    return validYearMonth(+match[2], +match[1]);
  }

  match = v.match(/^(\d{4})-(\d{1,2})$/);
  if (match) {
    return validYearMonth(+match[1], +match[2]);
  }

  match = v.match(/^(\d{4})\/(\d{1,2})$/);
  if (match) {
    return validYearMonth(+match[1], +match[2]);
  }

  match = v.match(/^(\d{4})$/);
  if (match) {
    return validYearMonth(+match[1], 1);
  }

  return null;
}

function validYearMonth(
  year: number,
  month: number
): { year: number; month: number } | null {
  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return null;
  }
  if (month < 1 || month > 12 || year < 1900 || year > 2100) {
    return null;
  }
  return { year, month };
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
