import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminDashboardComponent } from '../../pages/admin/admin-dashboard/admin-dashboard';
import { WorkerDashboardComponent } from '../../pages/trabajador/worker-dashboard/worker-dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminDashboardComponent, WorkerDashboardComponent], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  username: string = 'Usuario';
  userRole: string = ''; 

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('username');
      const savedRole = localStorage.getItem('role'); 
      
      if (savedUser) {
        this.username = savedUser;
      }
      if (savedRole) {
        this.userRole = savedRole;
      }
    }
  }

  onLogout(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear(); 
    }
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
