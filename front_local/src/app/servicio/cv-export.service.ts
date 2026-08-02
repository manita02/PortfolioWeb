import { Injectable } from '@angular/core';
import { forkJoin, Observable, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { EducacionService } from './educacion.service';
import { HabilidadesService } from './habilidades.service';
import { PersonaService } from './persona.service';
import { ProyectoService } from './proyecto.service';
import { RedsocialService } from './redsocial.service';
import { SExperienciaService } from './s-experiencia.service';
import { TipoHabilidadService } from './tipo-habilidad.service';
import { buildCvAtsDocument, buildCvFilename } from '../util/cv-ats.builder';
import { downloadPdfDocument } from '../util/pdfmake-browser';

@Injectable({
  providedIn: 'root',
})
export class CvExportService {
  constructor(
    private personaService: PersonaService,
    private educacionService: EducacionService,
    private experienciaService: SExperienciaService,
    private proyectoService: ProyectoService,
    private habilidadesService: HabilidadesService,
    private redsocialService: RedsocialService,
    private tipoHabilidadService: TipoHabilidadService
  ) {}

  downloadCvAts(): Observable<string> {
    return forkJoin({
      persona: this.personaService.lista(),
      educacion: this.educacionService.lista(),
      experiencia: this.experienciaService.lista(),
      proyecto: this.proyectoService.lista(),
      habilidades: this.habilidadesService.lista(),
      redes: this.redsocialService.lista(),
      tipoHabilidad: this.tipoHabilidadService.lista(),
    }).pipe(
      switchMap(data => {
        const persona = data.persona[0];
        if (!persona) {
          throw new Error('No hay datos de perfil para generar el CV.');
        }

        const doc = buildCvAtsDocument({
          persona,
          educacion: data.educacion,
          experiencia: data.experiencia,
          proyecto: data.proyecto,
          habilidades: data.habilidades,
          redes: data.redes,
          tipoHabilidad: data.tipoHabilidad,
        });

        const filename = buildCvFilename(persona);
        return from(downloadPdfDocument(doc, filename).then(() => filename));
      }),
      catchError(error => {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('No se pudo generar el CV.');
      })
    );
  }
}
