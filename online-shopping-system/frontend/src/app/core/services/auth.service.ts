import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap, catchError, of } from 'rxjs';
import { User, AuthResponse } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private baseUrl = 'http://127.0.0.1:8000/api/v1/user';

  readonly currentUser = signal<User | null>(null);
  readonly token = signal<string | null>(null);

  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role?.toLowerCase() === 'admin');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedToken = localStorage.getItem('luxemart_token');
      const savedUser = localStorage.getItem('luxemart_user');
      if (savedToken && savedUser) {
        try {
          this.token.set(savedToken);
          this.currentUser.set(JSON.parse(savedUser));
        } catch {
          this.logout();
        }
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
      tap((res) => {
        this.setSession(res);
      })
    );
  }

  register(userData: { name: string; email: string; password: string; role?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, userData).pipe(
      tap((res) => {
        this.setSession(res);
      })
    );
  }

  fetchProfile(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      tap((user) => {
        this.currentUser.set(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('luxemart_user', JSON.stringify(user));
        }
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    this.token.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('luxemart_token');
      localStorage.removeItem('luxemart_user');
    }
  }

  private setSession(authRes: AuthResponse): void {
    this.token.set(authRes.access_token);
    this.currentUser.set(authRes.user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('luxemart_token', authRes.access_token);
      localStorage.setItem('luxemart_user', JSON.stringify(authRes.user));
    }
  }
}
