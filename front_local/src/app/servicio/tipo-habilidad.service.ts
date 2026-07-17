import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoHabilidad } from '../modelo/tipo-habilidad';

@Injectable({
  providedIn: 'root'
})
export class TipoHabilidadService {
  private readonly url = `${environment.apiUrl}/tipo-habilidad/`;

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<TipoHabilidad[]> {
    return this.httpClient.get<TipoHabilidad[]>(this.url + 'lista');
  }
}
