import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoHabilidad } from '../modelo/tipo-habilidad';

@Injectable({
  providedIn: 'root'
})
export class TipoHabilidadService {
  private readonly url = `${environment.apiUrl}/tipo-habilidad/`;

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<TipoHabilidad[]> {
    return throwError(() => new Error(
      'GET /tipo-habilidad/lista no disponible en el backend. Ver CTipoEmpleo como referencia.'
    ));
    // return this.httpClient.get<TipoHabilidad[]>(this.url + 'lista');
  }
}
