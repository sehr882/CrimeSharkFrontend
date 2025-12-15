import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private USER_KEY = 'crimeshark_user';

  login(username: string) {
    localStorage.setItem(this.USER_KEY, username);
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.USER_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }
}

