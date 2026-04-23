import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }


  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/register`, data);
  }


  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/login`, data);
  }


  isLoggedIn(): boolean {
    // Example: check if a token exists in localStorage
    if (!isPlatformBrowser(this.platformId)) return false;
    return !!localStorage.getItem('token');
  }


  setToken(token: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem('token', token);
  }


  logout() {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem('token');
  }
}