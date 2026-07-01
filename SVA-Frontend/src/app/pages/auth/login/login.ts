import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  irACambiarPassword(): void {
    this.router.navigate(['/cambiar-password']);
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, ingresa tu usuario y contraseña.',
        confirmButtonColor: '#1f6feb'
      });
      return;
    }

    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role); 
        
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Ingreso exitoso al sistema SVA.',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err: any) => {
        this.isLoading = false;
        
        let mensajeError = 'Error de conexión con el servidor. Inténtalo más tarde.';
        
        if (err.status === 401) {
          mensajeError = 'Contraseña incorrecta. Inténtalo de nuevo.';
        } else if (err.status === 404) {
          mensajeError = 'El usuario ingresado no está registrado en el sistema SVA.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: mensajeError,
          confirmButtonColor: '#1f6feb'
        });
      }
    });
  }
}
