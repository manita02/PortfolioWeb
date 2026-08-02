import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { TipoHabilidad } from '../modelo/tipo-habilidad';

import { PortfolioDataService } from './portfolio-data.service';



@Injectable({

  providedIn: 'root'

})

export class TipoHabilidadService {

  private readonly url = `${environment.apiUrl}/tipo-habilidad/`;



  constructor(

    private httpClient: HttpClient,

    private portfolioData: PortfolioDataService

  ) {}



  public lista(): Observable<TipoHabilidad[]> {

    if (environment.staticMode) {

      return this.portfolioData.getTipoHabilidad();

    }

    return this.httpClient.get<TipoHabilidad[]>(this.url + 'lista');

  }

}


