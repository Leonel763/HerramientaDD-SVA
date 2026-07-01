import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';
import { Cliente } from '../../../models/cliente';
import { Sucursal } from '../../../models/sucursal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-empresas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-empresas.html',
  styleUrl: './gestion-empresas.css'
})
export class GestionEmpresas implements OnInit {

  subTabEmpresa: string = 'lista';
  listaEmpresas: Cliente[] = [];

  nuevoCliente: Cliente = {
    ruc: '',
    razonSocial: '',
    sucursales: []
  };

  nuevaSucursalTemporal: Sucursal = {
    nombreSucursal: '',
    direccion: ''
  };

  empresaSeleccionada: Cliente | null = null;
  
  nuevaSedeIndividual: Sucursal = {
    nombreSucursal: '',
    direccion: ''
  };

  isModalOpen: boolean = false;

  constructor(private empresaService: EmpresaService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.cargarEmpresas();
    }, 50);
  }

  cargarEmpresas(): void {
    this.empresaService.listarTodo().subscribe({
      next: (data) => this.listaEmpresas = data,
      error: (err) => console.error(err)
    });
  }

  agregarSucursalALaCola(): void {
    if (!this.nuevaSucursalTemporal.nombreSucursal.trim() || !this.nuevaSucursalTemporal.direccion.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, ingresa el nombre y la dirección de la sucursal.',
        confirmButtonColor: '#1f6feb'
      });
      return;
    }
    if (!this.nuevoCliente.sucursales) {
      this.nuevoCliente.sucursales = [];
    }
    this.nuevoCliente.sucursales.push({ ...this.nuevaSucursalTemporal });
    this.nuevaSucursalTemporal.nombreSucursal = '';
    this.nuevaSucursalTemporal.direccion = '';
  }

  onAddCompany(): void {
    if (!this.nuevoCliente.ruc.trim() || !this.nuevoCliente.razonSocial.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos de la empresa faltantes',
        text: 'Por favor, ingresa el RUC y la Razón Social.',
        confirmButtonColor: '#1f6feb'
      });
      return;
    }

    this.empresaService.guardarCliente(this.nuevoCliente).subscribe({
      next: (response: any) => {
        const textoMensaje = typeof response === 'string' ? response : (response?.mensaje || 'El cliente corporativo se guardó correctamente.');
        
        Swal.fire({
          icon: 'success',
          title: 'Empresa Registrada',
          text: textoMensaje,
          confirmButtonColor: '#1f6feb',
          timer: 2000
        });
        this.resetFormularioEmpresa();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error de Registro',
          text: err.error?.error || err.error?.mensaje || 'Ocurrió un error al registrar el cliente corporativo.',
          confirmButtonColor: '#1f6feb'
        });
      }
    });
  }

  onGestionarSucursales(empresa: Cliente): void {
    this.empresaSeleccionada = JSON.parse(JSON.stringify(empresa));
    this.isModalOpen = true;
    if (typeof window !== 'undefined') {
      document.body.classList.add('modal-open');
    }
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    if (typeof window !== 'undefined') {
      document.body.classList.remove('modal-open');
    }
  }

  onAgregarSedeSuela(): void {
    if (!this.nuevaSedeIndividual.nombreSucursal.trim() || !this.nuevaSedeIndividual.direccion.trim() || !this.empresaSeleccionada?.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, ingresa el nombre y la dirección de la nueva sucursal.',
        confirmButtonColor: '#1f6feb'
      });
      return;
    }

    this.empresaService.agregarSucursal(this.empresaSeleccionada.id, this.nuevaSedeIndividual).subscribe({
      next: (response: any) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Sucursal agregada con éxito',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        });
        this.nuevaSedeIndividual = { nombreSucursal: '', direccion: '' };
        this.actualizarDatosModalYTabla();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al agregar',
          text: 'No se pudo agregar la sucursal al sistema.',
          confirmButtonColor: '#1f6feb'
        });
      }
    });
  }

  onEliminarSede(sucursalId: number | undefined): void {
    if (!sucursalId) return;

    Swal.fire({
      title: '¿Eliminar Sucursal?',
      text: '¿Estás seguro de que deseas eliminar esta sucursal del sistema?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.empresaService.eliminarSucursal(sucursalId).subscribe({
          next: (response: any) => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Sucursal eliminada',
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true
            });
            this.actualizarDatosModalYTabla();
          },
          error: (err) => {
            Swal.fire({
              
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al intentar eliminar la sucursal.',
              confirmButtonColor: '#1f6feb'
              
            });
          }
        });
      }
    });
  }

  onEliminarClienteCorporativo(clienteId: number | undefined): void {
    if (!clienteId) return;

    Swal.fire({
      title: '¿Eliminar Cliente Corporativo?',
      text: 'Se borrarán también todas sus sucursales vinculadas. Esta acción no se puede deshacer.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar empresa',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.empresaService.eliminarCliente(clienteId).subscribe({
          next: (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Empresa Eliminada',
              text: 'El cliente corporativo ha sido eliminado del sistema.',
              confirmButtonColor: '#1f6feb',
              timer: 2000
            });
            this.cerrarModal();
            this.cargarEmpresas();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error de Eliminación',
              text: 'No se pudo procesar la eliminación del cliente corporativo.',
              confirmButtonColor: '#1f6feb'
            });
          }
        });
      }
    });
  }

  actualizarDatosModalYTabla(): void {
    this.empresaService.listarTodo().subscribe({
      next: (data) => {
        this.listaEmpresas = data;
        if (this.empresaSeleccionada && this.empresaSeleccionada.id) {
          const actualizada = data.find((e: Cliente) => e.id === this.empresaSeleccionada!.id);
          if (actualizada) {
            this.empresaSeleccionada = JSON.parse(JSON.stringify(actualizada));
          }
        }
      }
    });
  }

  resetFormularioEmpresa(): void {
    this.nuevoCliente = { ruc: '', razonSocial: '', sucursales: [] };
    this.nuevaSucursalTemporal = { nombreSucursal: '', direccion: '' };
    this.cargarEmpresas();
    this.subTabEmpresa = 'lista';
  }
}
