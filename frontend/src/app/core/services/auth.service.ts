import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_BASE_URL } from './api.config';

export type UserRole = 'user' | 'therapist' | 'admin';

export interface CurrentUser {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  therapistProfile?: {
    status?: string;
    firstName?: string;
    lastName?: string;
    qualification?: string;
    experienceText?: string;
    bio?: string;
    specializations?: string[];
    languages?: string[];
    consultationPlans?: Array<{ label: string; sessionCount: number; price: number; mode: string }>;
  };
}

interface AuthResponse {
  token: string;
  user: CurrentUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenKey = 'mindease-session-token';
  private readonly userKey = 'mindease-session-user';
  private readonly handoffKey = 'mindease-tab-handoff';
  private readonly currentUserState = signal<CurrentUser | null>(null);

  readonly currentUser = computed(() => this.currentUserState());
  readonly isAuthenticated = computed(() => !!this.currentUserState());

  constructor() {
    this.consumeTabHandoff();

    const cachedUser = this.getStoredUser();
    if (cachedUser) {
      this.setCurrentUser(cachedUser);
    }

    const token = this.getToken();
    if (token) {
      this.loadCurrentUser().subscribe({
        error: () => this.clearSession()
      });
    }
  }

  registerUser(payload: { fullName: string; email: string; phone: string; password: string }) {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/register`, payload).pipe(
      tap((response) => this.setSession(response))
    );
  }

  registerTherapist(payload: FormData) {
    return this.http.post<{ message: string; therapist: CurrentUser }>(`${API_BASE_URL}/auth/register-therapist`, payload);
  }

  login(payload: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/auth/login`, payload).pipe(
      tap((response) => this.setSession(response))
    );
  }

  loadCurrentUser() {
    return this.http.get<{ user: CurrentUser }>(`${API_BASE_URL}/auth/me`).pipe(
      tap((response) => this.setCurrentUser(response.user))
    );
  }

  updateProfile(payload: { fullName: string; phone: string }) {
    return this.http.patch<{ user: CurrentUser }>(`${API_BASE_URL}/auth/me`, payload).pipe(
      tap((response) => this.setCurrentUser(response.user))
    );
  }

  logout() {
    this.clearSession();
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey) || localStorage.getItem('mindease-token');
  }

  getStoredUser(): CurrentUser | null {
    const raw = sessionStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) as CurrentUser : null;
  }

  /**
   * Stores a one-time session handoff so a newly opened therapist tab can
   * bootstrap with its own isolated session storage.
   */
  createTabHandoff(response: AuthResponse) {
    localStorage.setItem(this.handoffKey, JSON.stringify(response));
  }

  /**
   * Stores the token and current user immediately after auth succeeds.
   */
  setSession(response: AuthResponse) {
    sessionStorage.setItem(this.tokenKey, response.token);
    localStorage.removeItem('mindease-token');
    this.setCurrentUser(response.user);
  }

  clearSession() {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userKey);
    localStorage.removeItem('mindease-token');
    this.currentUserState.set(null);
  }

  private setCurrentUser(user: CurrentUser) {
    sessionStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserState.set(user);
  }

  /**
   * Applies a one-time auth handoff when a dashboard is intentionally opened
   * in a new tab.
   */
  private consumeTabHandoff() {
    if (sessionStorage.getItem(this.tokenKey)) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('handoff') !== '1') {
      return;
    }

    const raw = localStorage.getItem(this.handoffKey);
    if (!raw) {
      return;
    }

    const response = JSON.parse(raw) as AuthResponse;
    this.setSession(response);
    localStorage.removeItem(this.handoffKey);
    params.delete('handoff');
    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', nextUrl);
  }
}