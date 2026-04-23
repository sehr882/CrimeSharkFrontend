import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CrimeService {

  private baseUrl = `${environment.apiUrl}/crime`;

  statusUpdated$ = new ReplaySubject<string>(1);

  constructor(private http: HttpClient) {}

  getAllCrimes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?t=${Date.now()}`);
  }

  getCrimeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  reportCrime(data: any, file?: File | null): Observable<any> {
    const formData = new FormData();
    formData.append('crimeType', data.crimeType);
    formData.append('crimeTitle', data.crimeTitle);
    formData.append('location', data.location);
    formData.append('description', data.description);
    formData.append('dateOfCrime', data.dateOfCrime);
    formData.append('latitude', data.latitude);
    formData.append('longitude', data.longitude);
    if (data.timeOfCrime) formData.append('timeOfCrime', data.timeOfCrime);
    if (data.victimPhone) formData.append('victimPhone', data.victimPhone);
    if (file) formData.append('evidence', file);

    // Auth header attached automatically by AuthInterceptor
    return this.http.post(`${this.baseUrl}/report`, formData);
  }

  updateReportStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}/status`, { status });
  }

  assignOfficer(crimeId: string, officerId: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${crimeId}/assign`, { officerId });
  }

  getMyCrimes(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/my`).pipe(
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
          dateOfCrime: item?.dateOfCrime ?? item?.createdAt ?? null,
        }));
      })
    );
  }

  getCityStats(): Observable<{ city: string; count: number }[]> {
    return this.http.get<{ city: string; count: number }[]>(`${this.baseUrl}/stats/city`);
  }

  getHotspots(): Observable<{ latitude: number; longitude: number }[]> {
    return this.http.get<{ latitude: number; longitude: number }[]>(`${this.baseUrl}/hotspots`);
  }

  getAllCrimesForOfficer(officerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?officerId=${officerId}&t=${Date.now()}`);
  }

  getCrimesByOfficer(officerId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/officer/${officerId}`);
  }
}
