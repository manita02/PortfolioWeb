import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { EducacionDto } from '../modelo/educacion.dto';

import { PortfolioDataService } from './portfolio-data.service';



@Injectable({

  providedIn: 'root'

})

export class EducacionService {

  private readonly url = `${environment.apiUrl}/educacion/`;



  constructor(

    private httpClient: HttpClient,

    private portfolioData: PortfolioDataService

  ) {}



  public lista(): Observable<EducacionDto[]> {

    if (environment.staticMode) {

      return this.portfolioData.getEducacion();

    }

    return this.httpClient.get<EducacionDto[]>(this.url + 'lista');

  }



  public detail(id: number): Observable<EducacionDto> {

    if (environment.staticMode) {

      return this.portfolioData.getEducacionDetail(id);

    }

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


