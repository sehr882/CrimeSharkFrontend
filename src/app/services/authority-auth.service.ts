import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorityAuthService {

  private apiUrl = 'http://localhost:3000/authority';

  constructor(private http: HttpClient) {}

  login(data: { cnic: string; password: string; accessCode: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('authority_token', response.access_token);
        localStorage.setItem('authority_user', JSON.stringify(response.authority));
      })
    );
  }

  getToken() {
    return localStorage.getItem('authority_token');
  }

  getUser() {
    return JSON.parse(localStorage.getItem('authority_user') || '{}');
  }

  logout() {
    localStorage.removeItem('authority_token');
    localStorage.removeItem('authority_user');
  }
}