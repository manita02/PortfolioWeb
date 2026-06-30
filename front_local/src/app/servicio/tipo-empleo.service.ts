import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoEmpleo } from '../modelo/tipo-empleo';

@Injectable({
  providedIn: 'root'
})
export class TipoEmpleoService {
  private readonly url = `${environment.apiUrl}/tipo-empleo/`;

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<TipoEmpleo[]> {
    return this.httpClient.get<TipoEmpleo[]>(this.url + 'lista');
  }
}
