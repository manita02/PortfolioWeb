import { HabilidadDto } from './habilidad.dto';
import { Organizacion } from './organizacion';
import { TipoEducacion } from './tipo-educacion';

export interface EducacionDto {
  id?: number;
  nombreE: string;
  descripcionE: string;
  fechaInicio: string;
  fechaFin?: string | null;
  tipoEducacionId?: number | null;
  organizacionId?: number | null;
  habilidadesIds?: number[];
  tipoEducacion?: TipoEducacion;
  organizacion?: Organizacion;
  habilidades?: HabilidadDto[];
  archivoImagen?: string | null;
  archivoPdf?: string | null;
}
