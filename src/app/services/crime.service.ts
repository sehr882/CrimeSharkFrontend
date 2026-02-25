// crime.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CrimeService {

  private baseUrl = 'http://localhost:3000/crime';

  constructor(private http: HttpClient) {}

  // ✅ Get all crimes
  getAllCrimes(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // ✅ Report crime (protected, SSR safe)
  reportCrime(data: any, file?: File | null): Observable<any> {

    let headers = new HttpHeaders();

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const formData = new FormData();
    formData.append('crimeType', data.type);
    formData.append('crimeTitle', data.title);
    formData.append('location', data.area);
    formData.append('dateOfCrime', data.dateOfCrime);
    formData.append('description', data.description);

    if (file) {
      formData.append('evidence', file);
    }

    return this.http.post(`${this.baseUrl}/report`, formData, { headers });
  }

  // ✅ Get logged-in user's crimes (SSR safe)
  getMyCrimes(): Observable<any[]> {

    let headers = new HttpHeaders();

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return this.http.get<any>(`${this.baseUrl}/my`, { headers }).pipe(
      map((res: any) => {
        const rows =
          Array.isArray(res) ? res :
          Array.isArray(res?.data) ? res.data :
          Array.isArray(res?.crimes) ? res.crimes :
          Array.isArray(res?.reports) ? res.reports :
          [];

        return rows.map((item: any) => ({
          ...item,
          crimeTitle: item?.crimeTitle ?? item?.title ?? item?.crimeType ?? 'Untitled',
          dateOfCrime: item?.dateOfCrime ?? item?.createdAt ?? null
        }));
      })
    );
  }

}
