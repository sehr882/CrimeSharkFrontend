import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CrimeService {

  private baseUrl = 'http://localhost:3000/crime';

  constructor(private http: HttpClient) {}

  // ✅ Get all crimes
 getAllCrimes() {
  return this.http.get<any[]>(`${this.baseUrl}?t=${Date.now()}`);
}
getCrimeById(id: string) {
  return this.http.get<any>(`http://localhost:3000/crime/${id}`);
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

    // 🔥 MATCH BACKEND DTO EXACTLY
    formData.append('crimeType', data.crimeType);
    formData.append('crimeTitle', data.crimeTitle);
    formData.append('location', data.location);
    formData.append('description', data.description);
    formData.append('dateOfCrime', data.dateOfCrime);

    // 🔥 VERY IMPORTANT (heatmap dependency)
    formData.append('latitude', data.latitude);
    formData.append('longitude', data.longitude);

    if (file) {
      formData.append('evidence', file);
    }

    return this.http.post(`${this.baseUrl}/report`, formData, { headers });
  }

  // ✅ Get logged-in user's crimes
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