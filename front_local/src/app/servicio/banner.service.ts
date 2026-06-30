import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Banner } from '../modelo/banner';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private readonly url = `${environment.apiUrl}/banner/`; 

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Banner[]>{
    return this.httpClient.get<Banner[]>(this.url + 'lista'); 
  }

  public detail(id: number): Observable<Banner>{
    return this.httpClient.get<Banner>(this.url + `detail/${id}`);
  }

  public save(banner: Banner): Observable<any>{
    return this.httpClient.post<any>(this.url + 'create', banner); 
  }

  public update (id: number, banner: Banner): Observable<any>{
    return this.httpClient.put<any>(this.url + `update/${id}`, banner); 
  }

  public delete(id: number): Observable<any>{
    return this.httpClient.delete<any>(this.url + `delete/${id}`); 
  }
}
