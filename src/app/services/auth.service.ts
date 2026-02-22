import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000'; // NestJS backend URL

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Register API call
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/register`, data);
  }

  // Login API call
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/login`, data);
  }

  // ✅ NEW: check if user is logged in
  isLoggedIn(): boolean {
    // Example: check if a token exists in localStorage
    if (!isPlatformBrowser(this.platformId)) return false;
    return !!localStorage.getItem('token');
  }

  // Optional: store token after login
  setToken(token: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem('token', token);
  }

  // Optional: remove token on logout
  logout() {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem('token');
  }
}