import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EducacionDto } from '../modelo/educacion.dto';

@Injectable({
  providedIn: 'root'
})
export class EducacionService {
  private readonly url = `${environment.apiUrl}/educacion/`;

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<EducacionDto[]> {
    return this.httpClient.get<EducacionDto[]>(this.url + 'lista');
  }

  public detail(id: number): Observable<EducacionDto> {
    return this.httpClient.get<EducacionDto>(this.url + `detail/${id}`);
  }

  public save(educacion: EducacionDto): Observable<EducacionDto> {
    return this.httpClient.post<EducacionDto>(this.url + 'create', educacion);
  }

  public update(id: number, educacion: EducacionDto): Observable<EducacionDto> {
    return this.httpClient.put<EducacionDto>(this.url + `update/${id}`, educacion);
  }

  public delete(id: number): Observable<unknown> {
    return this.httpClient.delete(this.url + `delete/${id}`);
  }
}
