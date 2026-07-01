import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listarTodo(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  guardar(trabajador: Usuario): Observable<string> {
    return this.http.post(this.apiUrl, trabajador, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  actualizar(dni: string, trabajador: Usuario): Observable<string> {
    return this.http.put(`${this.apiUrl}/${dni}`, trabajador, {
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }

  eliminar(dni: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${dni}`, { 
      headers: this.getAuthHeaders(),
      responseType: 'text' 
    });
  }
}
