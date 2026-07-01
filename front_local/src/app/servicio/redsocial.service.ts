import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Redsocial } from '../modelo/redsocial';

@Injectable({
  providedIn: 'root'
})
export class RedsocialService {
  private readonly url = `${environment.apiUrl}/redesSociales/`;

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<Redsocial[]> {
    return this.httpClient.get<Redsocial[]>(this.url + 'lista');
  }

  public detail(id: number): Observable<Redsocial> {
    return this.httpClient.get<Redsocial>(this.url + `detail/${id}`);
  }

  public save(redsocial: Redsocial): Observable<unknown> {
    return this.httpClient.post(this.url + 'create', redsocial);
  }

  public update(id: number, redsocial: Redsocial): Observable<unknown> {
    return this.httpClient.put(this.url + `update/${id}`, redsocial);
  }

  public delete(id: number): Observable<unknown> {
    return this.httpClient.delete(this.url + `delete/${id}`);
  }
}
