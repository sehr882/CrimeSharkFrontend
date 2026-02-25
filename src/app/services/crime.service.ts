// crime.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CrimeService {
  private baseUrl = 'http://localhost:3000/crime';

  constructor(private http: HttpClient) {}

  // Get all crimes
  getAllCrimes(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  //  Report crime (protected)
  reportCrime(data: any, file?: File | null): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const formData = new FormData();
    formData.append('crimeType', data.type);
    formData.append('crimeTitle', data.title);
    formData.append('location', data.area);
    formData.append('dateOfCrime', data.dateOfCrime);
    formData.append('description', data.description);

    if (file) formData.append('evidence', file);

    return this.http.post(`${this.baseUrl}/report`, formData, { headers });
  }

  //  Get logged-in user's crimes
  getMyCrimes(): Observable<any[]> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(`${this.baseUrl}/my`, { headers });
  }
}