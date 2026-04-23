import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfficerService {

  private baseUrl = `${environment.apiUrl}/officers`;

  constructor(private http: HttpClient) {}

  getAllOfficers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  addOfficer(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }

  getOfficerById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  updateOfficer(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }
}