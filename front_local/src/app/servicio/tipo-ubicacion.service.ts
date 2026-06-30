import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoUbicacion } from '../modelo/tipo-ubicacion';

@Injectable({
  providedIn: 'root'
})
export class TipoUbicacionService {
  private readonly url = `${environment.apiUrl}/tipo-ubicacion/`;

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<TipoUbicacion[]> {
    return this.httpClient.get<TipoUbicacion[]>(this.url + 'lista');
  }
}
