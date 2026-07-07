import { Service, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  access_token: string;
}

@Service()
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8080/api';
  private tokenKey = 'access_token';

  isLoggedIn = signal<boolean>(this.hasToken());
  currentUsername = signal<string>('');

  constructor() {
    if (this.hasToken()) {
      this.fetchIdentity();
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token);
        this.isLoggedIn.set(true);
        this.fetchIdentity();
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn.set(false);
    this.currentUsername.set('');
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private fetchIdentity(): void {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` });
    this.http.get<{ message: string }>(`${this.apiUrl}/identify`, { headers }).subscribe({
      next: (res) => {
        const match = res.message.match(/username:\s*([^,]+)/);
        this.currentUsername.set(match ? match[1].trim() : '');
      }
    });
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}