import { TipoHabilidad } from './tipo-habilidad';

export interface HabilidadDto {
  id?: number;
  nombre: string;
  img?: string | null;
  tipoHabilidadId?: number;
  tipoHabilidad?: TipoHabilidad;
}
