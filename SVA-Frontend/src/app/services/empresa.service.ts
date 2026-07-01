import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';
import { Sucursal } from '../models/sucursal';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = 'http://localhost:8080/api/empresas';

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

  listarTodo(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  guardarCliente(cliente: Cliente): Observable<string> {
    return this.http.post(this.apiUrl, cliente, { 
      headers: this.getAuthHeaders(), 
      responseType: 'text' 
    });
  }

  agregarSucursal(clienteId: number, sucursal: Sucursal): Observable<string> {
    return this.http.post(`${this.apiUrl}/${clienteId}/sucursales`, sucursal, { 
      headers: this.getAuthHeaders(), 
      responseType: 'text' 
    });
  }

  eliminarCliente(clienteId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/eliminar/${clienteId}`, { 
      headers: this.getAuthHeaders(), 
      responseType: 'text' 
    });
  }

  eliminarSucursal(sucursalId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/sucursales/eliminar/${sucursalId}`, { 
      headers: this.getAuthHeaders(), 
      responseType: 'text' 
    });
  }
}
