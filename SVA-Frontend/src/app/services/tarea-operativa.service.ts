import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TareaOperativa } from '../models/tarea-operativa';

export interface EvidenciaRequest {
  url: string;
  obs: string;
  latitud?: number;
  longitud?: number;
  precision?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TareaOperativaService {
  private apiUrl = 'http://localhost:8080/api/tareas-operativas';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  listarTodo(): Observable<TareaOperativa[]> {
    return this.http.get<TareaOperativa[]>(`${this.apiUrl}/all`, { headers: this.getAuthHeaders() });
  }

  asignarTarea(tarea: TareaOperativa): Observable<any> {
    return this.http.post(`${this.apiUrl}/asignar`, tarea, { headers: this.getAuthHeaders() });
  }

  listarPorTrabajador(dni: string): Observable<TareaOperativa[]> {
    return this.http.get<TareaOperativa[]>(`${this.apiUrl}/trabajador/${dni}`, { headers: this.getAuthHeaders() });
  }

  listarParaRevision(fecha: string): Observable<TareaOperativa[]> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<TareaOperativa[]>(`${this.apiUrl}/revision`, { headers: this.getAuthHeaders(), params });
  }

  resolverTarea(id: number, estado: string): Observable<any> {
    const params = new HttpParams().set('estado', estado);
    return this.http.put(`${this.apiUrl}/${id}/resolver`, {}, { headers: this.getAuthHeaders(), params });
  }

  subirEvidencia(id: number, url: string, obs: string, latitud?: number, longitud?: number, precision?: number): Observable<any> {
    const body: EvidenciaRequest = { url, obs, latitud, longitud, precision };
    return this.http.put(`${this.apiUrl}/${id}/subir-evidencia`, body, { headers: this.getAuthHeaders() });
  }
}
