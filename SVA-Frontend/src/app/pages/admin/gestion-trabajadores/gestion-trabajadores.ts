import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrabajadorService } from '../../../services/trabajador.service';
import { Usuario } from '../../../models/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-trabajadores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-trabajadores.html',
  styleUrl: './gestion-trabajadores.css'
})
export class GestionTrabajadores implements OnInit {

  @Input() myRole: string = '';

  subTab: string = 'lista';
  searchText: string = '';
  listaTrabajadores: Usuario[] = [];
  isEditing: boolean = false;

  newWorker: Usuario = {
    dni: '', nombre: '', apellidos: '', telefono: '',
    sueldoBase: 0, rol: 'TRABAJADOR', banco: '',
    numeroCuenta: '', password: ''
  };

  constructor(private trabajadorService: TrabajadorService) { }

  ngOnInit(): void {
    this.cargarTrabajadores();
  }

  cargarTrabajadores(): void {
    this.trabajadorService.listarTodo().subscribe({
      next: (data) => this.listaTrabajadores = data,
      error: (err) => console.error('Error al cargar usuarios en el panel:', err)
    });
  }

  get trabajadoresFiltrados(): Usuario[] {
    if (!this.listaTrabajadores || this.listaTrabajadores.length === 0) return [];

    let listaFiltradaPorRol: Usuario[] = [];
    const miRolLimpio = this.myRole ? this.myRole.toUpperCase().trim() : '';

    if (miRolLimpio === 'ADMINISTRADOR') {
      listaFiltradaPorRol = this.listaTrabajadores.filter(t => {
        const rolTrabajador = t.rol ? t.rol.toUpperCase().trim() : '';
        return rolTrabajador === 'TRABAJADOR';
      });
    } else {
      listaFiltradaPorRol = this.listaTrabajadores;
    }

    if (!this.searchText || !this.searchText.trim()) return listaFiltradaPorRol;

    const filter = this.searchText.toLowerCase().trim();
    return listaFiltradaPorRol.filter(trabajador => {
      const dni = trabajador.dni ? trabajador.dni.toLowerCase() : '';
      const nombre = trabajador.nombre ? trabajador.nombre.toLowerCase() : '';
      const apellidos = trabajador.apellidos ? trabajador.apellidos.toLowerCase() : '';
      return dni.includes(filter) || nombre.includes(filter) || apellidos.includes(filter);
    });
  }

  onEditWorker(trabajador: Usuario): void {
    this.isEditing = true;
    this.subTab = 'agregar';
    this.newWorker = {
      ...trabajador,
      password: ''
    };
  }

  onSubmitWorker(): void {
    if (this.isEditing) {
      this.trabajadorService.actualizar(this.newWorker.dni, this.newWorker).subscribe({
        next: (response: any) => {
          const textoMensaje = typeof response === 'string' ? response : (response?.mensaje || 'Datos actualizados correctamente en el sistema SVA.');
          Swal.fire({
            icon: 'success',
            title: 'Actualización Exitosa',
            text: textoMensaje,
            confirmButtonColor: '#1f6feb',
            timer: 2000
          });
          this.resetFormulario();
        },
        error: (err) => {
          console.error('Error al actualizar el registro:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: err.error?.error || err.error?.mensaje || 'Ocurrió un error al intentar actualizar los datos en el servidor.',
            confirmButtonColor: '#1f6feb'
          });
        }
      });
    } else {
      this.onAddWorker();
    }
  }

  onDeleteWorker(dni: string): void {
    Swal.fire({
      title: '¿Eliminar Trabajador?',
      text: `¿Estás seguro de que deseas eliminar al usuario con DNI ${dni}? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.trabajadorService.eliminar(dni).subscribe({
          next: (response: any) => {
            const textoMensaje = typeof response === 'string' ? response : (response?.mensaje || 'El trabajador fue eliminado con éxito.');
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: textoMensaje,
              confirmButtonColor: '#1f6feb',
              timer: 2000
            });
            this.cargarTrabajadores();
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error de Eliminación',
              text: err.error?.error || err.error?.mensaje || 'No se pudo procesar la eliminación en el servidor. Inténtalo de nuevo.',
              confirmButtonColor: '#1f6feb'
            });
          }
        });
      }
    });
  }

  onAddWorker(): void {
    this.trabajadorService.guardar(this.newWorker).subscribe({
      next: (response: any) => {
        const textoMensaje = typeof response === 'string' ? response : (response?.mensaje || 'El trabajador ha sido registrado correctamente.');
        Swal.fire({
          icon: 'success',
          title: 'Registro Exitoso',
          text: textoMensaje,
          confirmButtonColor: '#1f6feb',
          timer: 2000
        });
        this.resetFormulario();
      },
      error: (err) => {
        console.error('Error al guardar el registro:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error de Registro',
          text: err.error?.error || err.error?.mensaje || 'Ocurrió un error al intentar guardar el usuario en el sistema SVA.',
          confirmButtonColor: '#1f6feb'
        });
      }
    });
  }

  resetFormulario(): void {
    this.isEditing = false;
    this.newWorker = {
      dni: '', nombre: '', apellidos: '', telefono: '',
      sueldoBase: 0, rol: 'TRABAJADOR', banco: '',
      numeroCuenta: '', password: ''
    };
    this.cargarTrabajadores();
    this.subTab = 'lista';
  }
}
