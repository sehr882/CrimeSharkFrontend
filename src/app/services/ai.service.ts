import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private apiUrl = 'http://127.0.0.1:8000/predict';

  constructor(private http: HttpClient) { }

  checkSafety(location: string): Observable<any> {
    return this.http.post(this.apiUrl, {
      location: location
    });
  }
}