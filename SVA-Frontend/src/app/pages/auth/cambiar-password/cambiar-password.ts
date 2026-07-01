import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cambiar-password.html',
  styleUrl: './cambiar-password.css'
})
export class CambiarPassword {
  username: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  isLoading: boolean = false;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleOldPasswordVisibility(): void {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  regresarLogin(): void {
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
    if (!this.username || !this.oldPassword || !this.newPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, llena todos los campos requeridos.',
        confirmButtonColor: '#1f6feb'
      });
      return;
    }

    this.isLoading = true;

    this.authService.cambiarPassword(this.username, this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.isLoading = false;
        
        Swal.fire({
          icon: 'success',
          title: 'Contraseña Actualizada',
          text: 'Tu contraseña se ha cambiado correctamente.',
          confirmButtonColor: '#1f6feb'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err: any) => {
        this.isLoading = false;
        
        let mensajeError = 'Error de conexión con el servidor. Inténtalo más tarde.';
        
        if (err.status === 401) {
          mensajeError = 'La contraseña actual ingresada es incorrecta.';
        } else if (err.status === 404) {
          mensajeError = 'El DNI ingresado no se encuentra registrado en el sistema SVA.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Error al cambiar contraseña',
          text: mensajeError,
          confirmButtonColor: '#1f6feb'
        });
      }
    });
  }
}
