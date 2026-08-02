import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { ExperienciaDto } from '../modelo/experiencia.dto';

import { PortfolioDataService } from './portfolio-data.service';



@Injectable({

  providedIn: 'root'

})

export class SExperienciaService {

  private readonly url = `${environment.apiUrl}/explab/`;



  constructor(

    private httpClient: HttpClient,

    private portfolioData: PortfolioDataService

  ) {}



  public lista(): Observable<ExperienciaDto[]> {

    if (environment.staticMode) {

      return this.portfolioData.getExperiencia();

    }

    return this.httpClient.get<ExperienciaDto[]>(this.url + 'lista');

  }



  public detail(id: number): Observable<ExperienciaDto> {

    if (environment.staticMode) {

      return this.portfolioData.getExperienciaDetail(id);

    }

    return this.httpClient.get<ExperienciaDto>(this.url + `detail/${id}`);

  }



  public save(experiencia: ExperienciaDto): Observable<ExperienciaDto> {

    return this.httpClient.post<ExperienciaDto>(this.url + 'create', experiencia);

  }



  public update(id: number, experiencia: ExperienciaDto): Observable<ExperienciaDto> {

    return this.httpClient.put<ExperienciaDto>(this.url + `update/${id}`, experiencia);

  }



  public delete(id: number): Observable<unknown> {

    return this.httpClient.delete(this.url + `delete/${id}`);

  }

}


