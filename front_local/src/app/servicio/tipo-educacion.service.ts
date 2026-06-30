import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoEducacion } from '../modelo/tipo-educacion';

@Injectable({
  providedIn: 'root'
})
export class TipoEducacionService {
  private readonly url = `${environment.apiUrl}/tipo-educacion/`;

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<TipoEducacion[]> {
    // Endpoint pendiente en backend — descomentar cuando exista CTipoEducacion
    return throwError(() => new Error(
      'GET /tipo-educacion/lista no disponible en el backend. Ver CTipoEmpleo como referencia.'
    ));
    // return this.httpClient.get<TipoEducacion[]>(this.url + 'lista');
  }
}
