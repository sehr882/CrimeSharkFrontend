import {
  Inject,
  Injectable,
  PLATFORM_ID,
  computed,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthorityAuthService } from '../services/authority-auth.service';

export type UserKind = 'citizen' | 'officer' | 'admin' | null;

export interface CitizenUser {
  id?: string;
  username: string;
  loginTime: string;
}

export interface AuthorityUser {
  _id?: string;
  cnic?: string;
  name?: string;
  role?: string;
  station?: string;
  rank?: string;
}

interface SessionState {
  kind: UserKind;
  token: string | null;
  citizen: CitizenUser | null;
  authority: AuthorityUser | null;
}

const EMPTY: SessionState = {
  kind: null,
  token: null,
  citizen: null,
  authority: null,
};

// Single source of truth for "who is logged in right now."
// Replaces ad-hoc localStorage reads scattered across navbars/components.
@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly state = signal<SessionState>(EMPTY);

  readonly kind = computed(() => this.state().kind);
  readonly token = computed(() => this.state().token);
  readonly citizen = computed(() => this.state().citizen);
  readonly authority = computed(() => this.state().authority);

  readonly isLoggedIn = computed(() => this.state().kind !== null);
  readonly isCitizen = computed(() => this.state().kind === 'citizen');
  readonly isOfficer = computed(() => this.state().kind === 'officer');
  readonly isAdmin = computed(() => this.state().kind === 'admin');

  readonly displayName = computed(() => {
    const s = this.state();
    if (s.kind === 'citizen') return s.citizen?.username ?? 'Citizen';
    if (s.kind === 'officer' || s.kind === 'admin') {
      return s.authority?.name ?? (s.kind === 'admin' ? 'Admin' : 'Officer');
    }
    return null;
  });

  constructor(
    private readonly auth: AuthService,
    private readonly authorityAuth: AuthorityAuthService,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {
    this.hydrateFromStorage();
  }

  loginCitizen(credentials: { username: string; password: string }): Observable<any> {
    return this.auth.login(credentials).pipe(
      tap((res: any) => {
        const token = res?.token ?? res?.access_token;
        const citizen: CitizenUser = {
          id: res?.user?._id ?? res?.user?.id,
          username: credentials.username,
          loginTime: new Date().toISOString(),
        };
        this.persistCitizen(token, citizen);
      }),
    );
  }

  loginAuthority(credentials: {
    cnic: string;
    password: string;
    accessCode: string;
  }): Observable<any> {
    return this.authorityAuth.login(credentials).pipe(
      tap((res: any) => {
        const token = res?.access_token;
        const authority: AuthorityUser = res?.authority ?? res?.officer ?? {};
        const role = this.decodeRole(token) ?? authority?.role;
        this.persistAuthority(token, authority, role);
      }),
    );
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('authority_token');
      localStorage.removeItem('authority_user');
    }
    this.state.set(EMPTY);
  }

  // ── internals ────────────────────────────────────────────────────────────

  private hydrateFromStorage() {
    if (!this.isBrowser()) return;

    const authorityToken = localStorage.getItem('authority_token');
    if (authorityToken) {
      const authority = this.safeParse<AuthorityUser>(localStorage.getItem('authority_user'));
      const role = this.decodeRole(authorityToken) ?? authority?.role;
      this.state.set({
        kind: this.normalizeAuthorityRole(role),
        token: authorityToken,
        citizen: null,
        authority: authority ?? {},
      });
      return;
    }

    const citizenToken = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (citizenToken && isLoggedIn) {
      const citizen = this.safeParse<CitizenUser>(localStorage.getItem('user'));
      if (citizen?.username) {
        this.state.set({
          kind: 'citizen',
          token: citizenToken,
          citizen,
          authority: null,
        });
      }
    }
  }

  private persistCitizen(token: string, citizen: CitizenUser) {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
      localStorage.removeItem('authority_token'); // prevent cross-session bleed
      localStorage.removeItem('authority_user');
      localStorage.setItem('user', JSON.stringify(citizen));
      localStorage.setItem('isLoggedIn', 'true');
    }
    this.state.set({ kind: 'citizen', token, citizen, authority: null });
  }

  private persistAuthority(token: string, authority: AuthorityUser, role: string | undefined) {
    if (this.isBrowser()) {
      localStorage.setItem('authority_token', token);
      localStorage.setItem('authority_user', JSON.stringify(authority));
      // The interceptor prefers authority_token, so keep `token` cleared
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    }
    this.state.set({
      kind: this.normalizeAuthorityRole(role),
      token,
      citizen: null,
      authority,
    });
  }

  private normalizeAuthorityRole(role: string | undefined): UserKind {
    const r = (role ?? '').toUpperCase();
    if (r === 'ADMIN') return 'admin';
    if (r === 'OFFICER') return 'officer';
    return 'officer'; // sensible default for authority tokens with unexpected casing
  }

  private decodeRole(token: string | null): string | undefined {
    if (!token) return undefined;
    const parts = token.split('.');
    if (parts.length !== 3) return undefined;
    try {
      const payload = JSON.parse(atob(parts[1]));
      return payload?.role;
    } catch {
      return undefined;
    }
  }

  private safeParse<T>(raw: string | null): T | null {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
