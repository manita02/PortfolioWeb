import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProyectoDto } from '../modelo/proyecto.dto';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private readonly url = `${environment.apiUrl}/proyecto/`;

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<ProyectoDto[]> {
    return this.httpClient.get<ProyectoDto[]>(this.url + 'lista');
  }

  public detail(id: number): Observable<ProyectoDto> {
    return this.httpClient.get<ProyectoDto>(this.url + `detail/${id}`);
  }

  public save(proyecto: ProyectoDto): Observable<ProyectoDto> {
    return this.httpClient.post<ProyectoDto>(this.url + 'create', proyecto);
  }

  public update(id: number, proyecto: ProyectoDto): Observable<ProyectoDto> {
    return this.httpClient.put<ProyectoDto>(this.url + `update/${id}`, proyecto);
  }

  public delete(id: number): Observable<unknown> {
    return this.httpClient.delete(this.url + `delete/${id}`);
  }
}
