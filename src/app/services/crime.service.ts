// crime.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CrimeService {
  private baseUrl = 'http://localhost:3000/crime'; // your backend URL

  constructor(private http: HttpClient) {}

  getAllCrimes(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  reportCrime(data: any, file?: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('crimeType', data.type);
    formData.append('crimeTitle', data.title);
    formData.append('location', data.area);
     formData.append('dateOfCrime', data.dateOfCrime);
    formData.append('description', data.description);
    if (file) formData.append('evidence', file);
    return this.http.post(`${this.baseUrl}/report`, formData);
}
}