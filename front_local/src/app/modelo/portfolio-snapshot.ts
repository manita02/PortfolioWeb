import { Banner } from '../modelo/banner';
import { EducacionDto } from '../modelo/educacion.dto';
import { ExperienciaDto } from '../modelo/experiencia.dto';
import { HabilidadDto } from '../modelo/habilidad.dto';
import { Organizacion } from '../modelo/organizacion';
import { Persona } from '../modelo/persona';
import { ProyectoDto } from '../modelo/proyecto.dto';
import { Redsocial } from '../modelo/redsocial';
import { TipoEducacion } from '../modelo/tipo-educacion';
import { TipoEmpleo } from '../modelo/tipo-empleo';
import { TipoHabilidad } from '../modelo/tipo-habilidad';
import { TipoUbicacion } from '../modelo/tipo-ubicacion';

export interface PortfolioSnapshot {
  exportedAt?: string;
  banner: Banner[];
  persona: Persona[];
  educacion: EducacionDto[];
  experiencia: ExperienciaDto[];
  proyecto: ProyectoDto[];
  habilidades: HabilidadDto[];
  redesSociales: Redsocial[];
  organizacion: Organizacion[];
  tipoHabilidad: TipoHabilidad[];
  tipoEducacion: TipoEducacion[];
  tipoEmpleo: TipoEmpleo[];
  tipoUbicacion: TipoUbicacion[];
}
