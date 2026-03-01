import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CrimeService {

  private baseUrl = 'http://localhost:3000/crime';

  // ReplaySubject(1) stores the last emission so components that mount
  // AFTER the update still receive the signal and re-fetch from backend.
  statusUpdated$ = new ReplaySubject<string>(1);

  constructor(private http: HttpClient) {}

  // ✅ Get all crimes
 getAllCrimes(): Observable<any> {
  console.log('CrimeService: Calling API:', `${this.baseUrl}?t=${Date.now()}`);
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

  // ✅ Update report status (authority only)
  updateReportStatus(id: string, status: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authority_token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return this.http.patch<any>(
      `${this.baseUrl}/${id}/status`,
      { status },
      { headers }
    );
  }

  // ✅ Assign officer to a crime (authority only)
  assignOfficer(crimeId: string, officerId: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authority_token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return this.http.patch<any>(
      `${this.baseUrl}/${crimeId}/assign`,
      { officerId },
      { headers }
    );
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