import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/auth'; // NestJS backend URL

  constructor(private http: HttpClient) {}

  // Register API call
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  // Login API call
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  // ✅ NEW: check if user is logged in
  isLoggedIn(): boolean {
    // Example: check if a token exists in localStorage
    return !!localStorage.getItem('token');
  }

  // Optional: store token after login
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Optional: remove token on logout
  logout() {
    localStorage.removeItem('token');
  }
}