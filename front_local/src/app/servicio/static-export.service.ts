import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StaticExportResult {
  exportedAt: string;
  outputPath: string;
  mediaFilesWritten: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class StaticExportService {
  private readonly url = `${environment.apiUrl}/api/static-export`;

  constructor(private http: HttpClient) {}

  generate(): Observable<StaticExportResult> {
    return this.http.post<StaticExportResult>(`${this.url}/generate`, null);
  }
}
