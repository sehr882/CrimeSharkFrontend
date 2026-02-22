// crime.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CrimeService {
  private baseUrl = 'http://localhost:3000/crimes'; // your backend URL

  constructor(private http: HttpClient) {}

  getAllCrimes(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  reportCrime(data: any, file?: File | null): Observable<any> {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('area', data.area);
  formData.append('type', data.type);
  if (file) formData.append('file', file);
  return this.http.post(this.baseUrl, formData);
}
}