import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Redsocial } from '../modelo/redsocial';

@Injectable({
  providedIn: 'root'
})
export class RedsocialService {

  redSocialURL = 'http://localhost:8080/redesSociales/'
  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Redsocial[]>{ 
    return this.httpClient.get<Redsocial[]>(this.redSocialURL + 'lista'); 
  }

  public detail(id: number): Observable<Redsocial>{
    return this.httpClient.get<Redsocial>(this.redSocialURL + `detail/${id}`);
  }

  public save(redsocial: Redsocial): Observable<any>{
    return this.httpClient.post<any>(this.redSocialURL + 'create', redsocial); 
  }

  public update(id: number, redsocial: Redsocial): Observable<any>{
    return this.httpClient.put<any>(this.redSocialURL + `update/${id}`, redsocial); 
  }

  public delete(id: number): Observable<any>{
    return this.httpClient.delete<any>(this.redSocialURL + `delete/${id}`); 
  }
}
