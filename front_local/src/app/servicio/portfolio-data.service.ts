import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, shareReplay, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Banner } from '../modelo/banner';
import { EducacionDto } from '../modelo/educacion.dto';
import { ExperienciaDto } from '../modelo/experiencia.dto';
import { HabilidadDto } from '../modelo/habilidad.dto';
import { Organizacion } from '../modelo/organizacion';
import { Persona } from '../modelo/persona';
import { PortfolioSnapshot } from '../modelo/portfolio-snapshot';
import { ProyectoDto } from '../modelo/proyecto.dto';
import { Redsocial } from '../modelo/redsocial';
import { TipoEducacion } from '../modelo/tipo-educacion';
import { TipoEmpleo } from '../modelo/tipo-empleo';
import { TipoHabilidad } from '../modelo/tipo-habilidad';
import { TipoUbicacion } from '../modelo/tipo-ubicacion';

@Injectable({
  providedIn: 'root',
})
export class PortfolioDataService {
  private cache$?: Observable<PortfolioSnapshot>;

  constructor(private http: HttpClient) {}

  load(): Observable<PortfolioSnapshot> {
    if (!environment.staticMode) {
      return throwError(() => new Error('PortfolioDataService solo se usa en modo estatico'));
    }
    if (!this.cache$) {
      this.cache$ = this.http.get<PortfolioSnapshot>(environment.dataUrl).pipe(shareReplay(1));
    }
    return this.cache$;
  }

  getBanner(): Observable<Banner[]> {
    return this.load().pipe(map(snapshot => snapshot.banner ?? []));
  }

  getBannerDetail(id: number): Observable<Banner> {
    return this.getBanner().pipe(
      map(items => items.find(item => item.id === id)),
      map(item => {
        if (!item) {
          throw new Error(`Banner ${id} no encontrado`);
        }
        return item;
      })
    );
  }

  getPersona(): Observable<Persona[]> {
    return this.load().pipe(map(snapshot => snapshot.persona ?? []));
  }

  getPersonaDetail(id: number): Observable<Persona> {
    return this.getPersona().pipe(
      map(items => items.find(item => item.id === id)),
      map(item => {
        if (!item) {
          throw new Error(`Persona ${id} no encontrada`);
        }
        return item;
      })
    );
  }

  getEducacion(): Observable<EducacionDto[]> {
    return this.load().pipe(map(snapshot => snapshot.educacion ?? []));
  }

  getEducacionDetail(id: number): Observable<EducacionDto> {
    return this.getEducacion().pipe(
      map(items => items.find(item => item.id === id)),
      map(item => {
        if (!item) {
          throw new Error(`Educacion ${id} no encontrada`);
        }
        return item;
      })
    );
  }

  getExperiencia(): Observable<ExperienciaDto[]> {
    return this.load().pipe(map(snapshot => snapshot.experiencia ?? []));
  }

  getExperienciaDetail(id: number): Observable<ExperienciaDto> {
    return this.getExperiencia().pipe(
      map(items => items.find(item => item.id === id)),
      map(item => {
        if (!item) {
          throw new Error(`Experiencia ${id} no encontrada`);
        }
        return item;
      })
    );
  }

  getProyecto(): Observable<ProyectoDto[]> {
    return this.load().pipe(map(snapshot => snapshot.proyecto ?? []));
  }

  getProyectoDetail(id: number): Observable<ProyectoDto> {
    return this.getProyecto().pipe(
      map(items => items.find(item => item.id === id)),
      map(item => {
        if (!item) {
          throw new Error(`Proyecto ${id} no encontrado`);
        }
        return item;
      })
    );
  }

  getHabilidades(): Observable<HabilidadDto[]> {
    return this.load().pipe(map(snapshot => snapshot.habilidades ?? []));
  }

  getHabilidadDetail(id: number): Observable<HabilidadDto> {
    return this.getHabilidades().pipe(
      map(items => items.find(item => item.id === id)),
      map(item => {
        if (!item) {
          throw new Error(`Habilidad ${id} no encontrada`);
        }
        return item;
      })
    );
  }

  getRedesSociales(): Observable<Redsocial[]> {
    return this.load().pipe(map(snapshot => snapshot.redesSociales ?? []));
  }

  getRedSocialDetail(id: number): Observable<Redsocial> {
    return this.getRedesSociales().pipe(
      map(items => items.find(item => item.id === id)),
      map(item => {
        if (!item) {
          throw new Error(`Red social ${id} no encontrada`);
        }
        return item;
      })
    );
  }

  getOrganizacion(): Observable<Organizacion[]> {
    return this.load().pipe(map(snapshot => snapshot.organizacion ?? []));
  }

  getOrganizacionDetail(id: number): Observable<Organizacion> {
    return this.getOrganizacion().pipe(
      map(items => items.find(item => item.id === id)),
      map(item => {
        if (!item) {
          throw new Error(`Organizacion ${id} no encontrada`);
        }
        return item;
      })
    );
  }

  getTipoHabilidad(): Observable<TipoHabilidad[]> {
    return this.load().pipe(map(snapshot => snapshot.tipoHabilidad ?? []));
  }

  getTipoEducacion(): Observable<TipoEducacion[]> {
    return this.load().pipe(map(snapshot => snapshot.tipoEducacion ?? []));
  }

  getTipoEmpleo(): Observable<TipoEmpleo[]> {
    return this.load().pipe(map(snapshot => snapshot.tipoEmpleo ?? []));
  }

  getTipoUbicacion(): Observable<TipoUbicacion[]> {
    return this.load().pipe(map(snapshot => snapshot.tipoUbicacion ?? []));
  }

  invalidateCache(): void {
    this.cache$ = undefined;
  }

  emptySnapshot(): PortfolioSnapshot {
    return {
      banner: [],
      persona: [],
      educacion: [],
      experiencia: [],
      proyecto: [],
      habilidades: [],
      redesSociales: [],
      organizacion: [],
      tipoHabilidad: [],
      tipoEducacion: [],
      tipoEmpleo: [],
      tipoUbicacion: [],
    };
  }

  asObservable(snapshot: PortfolioSnapshot): Observable<PortfolioSnapshot> {
    return of(snapshot);
  }
}
