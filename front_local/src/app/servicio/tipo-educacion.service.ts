import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoEducacion } from '../modelo/tipo-educacion';

@Injectable({
  providedIn: 'root'
})
export class TipoEducacionService {
  private readonly url = `${environment.apiUrl}/tipo-educacion/`;

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<TipoEducacion[]> {
    return this.httpClient.get<TipoEducacion[]>(this.url + 'lista');
  }
}
