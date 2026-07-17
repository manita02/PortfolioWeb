import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HabilidadDto } from '../modelo/habilidad.dto';

@Injectable({
  providedIn: 'root'
})
export class HabilidadesService {
  private readonly url = `${environment.apiUrl}/habilidades/`;

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<HabilidadDto[]> {
    return this.httpClient.get<HabilidadDto[]>(this.url + 'lista');
  }

  public detail(id: number): Observable<HabilidadDto> {
    return this.httpClient.get<HabilidadDto>(this.url + `detail/${id}`);
  }

  public save(habilidad: HabilidadDto): Observable<unknown> {
    return this.httpClient.post(this.url + 'create', habilidad);
  }

  public update(id: number, habilidad: HabilidadDto): Observable<unknown> {
    return this.httpClient.put(this.url + `update/${id}`, habilidad);
  }

  public delete(id: number): Observable<unknown> {
    return this.httpClient.delete(this.url + `delete/${id}`);
  }
}
