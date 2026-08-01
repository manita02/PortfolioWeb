import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TipoEmpleo } from '../modelo/tipo-empleo';
import { PortfolioDataService } from './portfolio-data.service';

@Injectable({
  providedIn: 'root'
})
export class TipoEmpleoService {
  private readonly url = `${environment.apiUrl}/tipo-empleo/`;

  constructor(
    private httpClient: HttpClient,
    private portfolioData: PortfolioDataService
  ) {}

  public lista(): Observable<TipoEmpleo[]> {
    if (environment.staticMode) {
      return this.portfolioData.getTipoEmpleo();
    }
    return this.httpClient.get<TipoEmpleo[]>(this.url + 'lista');
  }
}
