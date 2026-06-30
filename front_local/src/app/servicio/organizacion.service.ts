import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Organizacion } from '../modelo/organizacion';

@Injectable({
  providedIn: 'root'
})
export class OrganizacionService {
  private readonly url = `${environment.apiUrl}/organizacion/`;

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<Organizacion[]> {
    return this.httpClient.get<Organizacion[]>(this.url + 'lista');
  }

  public detail(id: number): Observable<Organizacion> {
    return this.httpClient.get<Organizacion>(this.url + `detail/${id}`);
  }

  public save(organizacion: Organizacion): Observable<Organizacion> {
    return this.httpClient.post<Organizacion>(this.url + 'create', organizacion);
  }

  public update(id: number, organizacion: Organizacion): Observable<Organizacion> {
    return this.httpClient.put<Organizacion>(this.url + `update/${id}`, organizacion);
  }

  public delete(id: number): Observable<unknown> {
    return this.httpClient.delete(this.url + `delete/${id}`);
  }
}
