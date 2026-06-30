import { HabilidadDto } from './habilidad.dto';
import { Organizacion } from './organizacion';

export interface ProyectoDto {
  id?: number;
  nombreE: string;
  descripcionE: string;
  link: string;
  esActual: boolean;
  fechaInicio: string;
  fechaFin?: string | null;
  organizacionId?: number | null;
  habilidadesIds?: number[];
  organizacion?: Organizacion;
  habilidades?: HabilidadDto[];
  imagen?: string | null;
}
