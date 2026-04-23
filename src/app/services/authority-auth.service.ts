import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorityAuthService {

  private apiUrl = `${environment.apiUrl}/authority`;

  constructor(private http: HttpClient) {}

  login(data: { cnic: string; password: string; accessCode: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('authority_token', response.access_token);
        // authority login returns .authority; officer login returns .officer
        const user = response.authority ?? response.officer ?? {};
        localStorage.setItem('authority_user', JSON.stringify(user));
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