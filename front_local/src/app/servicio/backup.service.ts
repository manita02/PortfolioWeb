import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private readonly url = `${environment.apiUrl}/api/backup`;

  constructor(private http: HttpClient) {}

  download(): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.url}/download`, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  upload(file: File): Observable<{ mensaje: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ mensaje: string }>(`${this.url}/upload`, formData);
  }

  filenameFromResponse(response: HttpResponse<Blob>, fallback: string): string {
    const disposition = response.headers.get('Content-Disposition') || '';
    const utfMatch = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
    if (utfMatch?.[1]) {
      return decodeURIComponent(utfMatch[1]);
    }
    const plainMatch = /filename="?([^";]+)"?/i.exec(disposition);
    if (plainMatch?.[1]) {
      return plainMatch[1];
    }
    return fallback;
  }
}
