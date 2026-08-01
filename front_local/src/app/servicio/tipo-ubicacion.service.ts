import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoUbicacion } from '../modelo/tipo-ubicacion';
import { PortfolioDataService } from './portfolio-data.service';

@Injectable({
  providedIn: 'root'
})
export class TipoUbicacionService {
  private readonly url = `${environment.apiUrl}/tipo-ubicacion/`;

  constructor(
    private httpClient: HttpClient,
    private portfolioData: PortfolioDataService
  ) {}

  public lista(): Observable<TipoUbicacion[]> {
    if (environment.staticMode) {
      return this.portfolioData.getTipoUbicacion();
    }
    return this.httpClient.get<TipoUbicacion[]>(this.url + 'lista');
  }
}
