import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CrimeService {

  private baseUrl = 'http://localhost:3000/crime';


  statusUpdated$ = new ReplaySubject<string>(1);

  constructor(private http: HttpClient) { }


  getAllCrimes(): Observable<any> {
    console.log('CrimeService: Calling API:', `${this.baseUrl}?t=${Date.now()}`);
    return this.http.get<any[]>(`${this.baseUrl}?t=${Date.now()}`);
  }
  getCrimeById(id: string) {
    return this.http.get<any>(`http://localhost:3000/crime/${id}`);
  }


  reportCrime(data: any, file?: File | null): Observable<any> {

    let headers = new HttpHeaders();

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const formData = new FormData();

    formData.append('crimeType', data.crimeType);
    formData.append('crimeTitle', data.crimeTitle);
    formData.append('location', data.location);
    formData.append('description', data.description);
    formData.append('dateOfCrime', data.dateOfCrime);

    formData.append('latitude', data.latitude);
    formData.append('longitude', data.longitude);
    if (data.victimPhone) {
  formData.append('victimPhone', data.victimPhone);
    }
    if (file) {
      formData.append('evidence', file);
    }

    return this.http.post(`${this.baseUrl}/report`, formData, { headers });
  }

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
  getCityStats(): Observable<{ city: string; count: number }[]> {
    return this.http.get<{ city: string; count: number }[]>(`${this.baseUrl}/stats/city`);
  }

  getAllCrimesForOfficer(officerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?officerId=${officerId}&t=${Date.now()}`);
  }

  getCrimesByOfficer(officerId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/officer/${officerId}`);
  }
}