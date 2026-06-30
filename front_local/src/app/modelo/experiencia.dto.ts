import { HabilidadDto } from './habilidad.dto';
import { Organizacion } from './organizacion';
import { TipoEmpleo } from './tipo-empleo';
import { TipoUbicacion } from './tipo-ubicacion';

export interface ExperienciaDto {
  id?: number;
  nombreE: string;
  descripcionE: string;
  esActual: boolean;
  fechaInicio: string;
  fechaFin?: string | null;
  tipoEmpleoId?: number | null;
  tipoUbicacionId?: number | null;
  organizacionId?: number | null;
  habilidadesIds?: number[];
  tipoEmpleo?: TipoEmpleo;
  tipoUbicacion?: TipoUbicacion;
  organizacion?: Organizacion;
  habilidades?: HabilidadDto[];
}
