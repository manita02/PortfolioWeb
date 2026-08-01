import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Persona } from '../modelo/persona';
import { PortfolioDataService } from './portfolio-data.service';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private readonly url = `${environment.apiUrl}/persona/`;

  constructor(
    private httpClient: HttpClient,
    private portfolioData: PortfolioDataService
  ) {}

  public lista(): Observable<Persona[]> {
    if (environment.staticMode) {
      return this.portfolioData.getPersona();
    }
    return this.httpClient.get<Persona[]>(this.url + 'lista');
  }

  public detail(id: number): Observable<Persona> {
    if (environment.staticMode) {
      return this.portfolioData.getPersonaDetail(id);
    }
    return this.httpClient.get<Persona>(this.url + `detail/${id}`);
  }

  public save(persona: Persona): Observable<unknown> {
    return this.httpClient.post(this.url + 'create', persona);
  }

  public update(id: number, persona: Persona): Observable<unknown> {
    return this.httpClient.put(this.url + `update/${id}`, persona);
  }

  public delete(id: number): Observable<unknown> {
    return this.httpClient.delete(this.url + `delete/${id}`);
  }
}
