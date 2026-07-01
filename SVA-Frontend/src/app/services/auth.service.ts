import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; 

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    
    return this.http.post<any>(`${this.apiUrl}/login`, body).pipe(
      tap(response => {
        if (typeof window !== 'undefined' && response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', username);
          if (response.role) {
            localStorage.setItem('role', response.role);
          }
        }
      })
    );
  }

  cambiarPassword(username: string, oldPassword: string, newPassword: string): Observable<any> {
    const body = { username, oldPassword, newPassword };
    return this.http.post<any>(`${this.apiUrl}/cambiar-password`, body);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
    }
  }
}
