import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TrabajadorService } from '../../../services/trabajador.service';
import { TareaOperativaService } from '../../../services/tarea-operativa.service';
import { GestionEmpresas } from '../gestion-empresas/gestion-empresas';
import { Sidebar } from '../../../shared/sidebar/sidebar';
import { GestionTrabajadores } from '../../admin/gestion-trabajadores/gestion-trabajadores';
import { TareaOperativa as TareaOperativaComponent } from '../tarea-operativa/tarea-operativa';
import { TareaRevision } from '../../admin/tarea-revision/tarea-revision';
import { Usuario } from '../../../models/usuario';
import { TareaOperativa } from '../../../models/tarea-operativa';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, GestionEmpresas, GestionTrabajadores, TareaOperativaComponent, TareaRevision, Sidebar],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
  username: string = 'Administrador';
  myRole: string = '';
  currentTab: string = 'resumen';
  listaTrabajadores: Usuario[] = [];
  tareasTotales: TareaOperativa[] = [];
  isMobileMenuOpen: boolean = false;

  constructor(
    private authService: AuthService,
    private trabajadorService: TrabajadorService,
    private tareaService: TareaOperativaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.username = localStorage.getItem('username') || 'Administrador';
      this.myRole = localStorage.getItem('role') || '';
    }
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.trabajadorService.listarTodo().subscribe(data => this.listaTrabajadores = data);
    this.tareaService.listarTodo().subscribe({
      next: (data) => this.tareasTotales = data,
      error: (err) => console.error(err)
    });
  }

  get tareasPendientes() {
    return this.tareasTotales.filter(t => t.estado === 'PENDIENTE').length;
  }

  get incidencias() {
    return this.tareasTotales.filter(t => t.estado === 'RECHAZADO' || t.estado === 'FALTA').length;
  }

  getTituloActual(): string {
    const titulos: { [key: string]: string } = {
      'resumen': 'Panel de Resumen',
      'tareaje': 'Planificación de Tareas Diarias',
      'revision': 'Control y Auditoría de Guardias',
      'trabajadores': 'Gestión de Personal',
      'empresas': 'Control Corporativo'
    };
    return titulos[this.currentTab] || 'Dashboard';
  }

  selectTab(tab: string): void {
    this.currentTab = tab;
    this.isMobileMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onLogout(): void {
    localStorage.clear();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
