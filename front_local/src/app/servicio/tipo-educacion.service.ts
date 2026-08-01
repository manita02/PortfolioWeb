import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoEducacion } from '../modelo/tipo-educacion';
import { PortfolioDataService } from './portfolio-data.service';

@Injectable({
  providedIn: 'root'
})
export class TipoEducacionService {
  private readonly url = `${environment.apiUrl}/tipo-educacion/`;

  constructor(
    private httpClient: HttpClient,
    private portfolioData: PortfolioDataService
  ) {}

  public lista(): Observable<TipoEducacion[]> {
    if (environment.staticMode) {
      return this.portfolioData.getTipoEducacion();
    }
    return this.httpClient.get<TipoEducacion[]>(this.url + 'lista');
  }
}
