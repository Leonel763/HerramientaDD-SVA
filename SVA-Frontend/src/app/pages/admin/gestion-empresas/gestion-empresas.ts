import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';
import { Cliente } from '../../../models/cliente';
import { Sucursal } from '../../../models/sucursal';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

declare const google: any;

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
    direccion: '',
    latitud: undefined,
    longitud: undefined,
    radioPermitido: 200
  };

  empresaSeleccionada: Cliente | null = null;
  
  nuevaSedeIndividual: Sucursal = {
    nombreSucursal: '',
    direccion: '',
    latitud: undefined,
    longitud: undefined,
    radioPermitido: 200
  };

  isModalOpen: boolean = false;

  mapAbierto: boolean = false;
  mapCargado: boolean = false;
  mapCargando: boolean = false;
  map: any = null;
  marker: any = null;
  mapTargetKey: string = '';
  private readonly googleMapsApiKey: string = environment.googleMapsApiKey;

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
    this.nuevaSucursalTemporal.latitud = undefined;
    this.nuevaSucursalTemporal.longitud = undefined;
    this.nuevaSucursalTemporal.radioPermitido = 200;
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
    this.cerrarMapa();
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
        this.nuevaSedeIndividual = { nombreSucursal: '', direccion: '', latitud: undefined, longitud: undefined, radioPermitido: 200 };
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
    this.nuevaSucursalTemporal = { nombreSucursal: '', direccion: '', latitud: undefined, longitud: undefined, radioPermitido: 200 };
    this.cargarEmpresas();
    this.subTabEmpresa = 'lista';
  }

  private obtenerObjetivoMapa(): Sucursal | null {
    if (this.mapTargetKey === 'temporal') return this.nuevaSucursalTemporal;
    if (this.mapTargetKey === 'individual') return this.nuevaSedeIndividual;
    return null;
  }

  private cargarGoogleMaps(): Promise<void> {
    return new Promise((resolve) => {
      if ((typeof google !== 'undefined' && google.maps) || !this.googleMapsApiKey) {
        this.mapCargado = typeof google !== 'undefined' && !!google.maps;
        resolve();
        return;
      }
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        const check = setInterval(() => {
          if (typeof google !== 'undefined' && google.maps) {
            clearInterval(check);
            this.mapCargado = true;
            resolve();
          }
        }, 200);
        return;
      }
      this.mapCargando = true;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.mapCargado = true;
        this.mapCargando = false;
        resolve();
      };
      script.onerror = () => {
        this.mapCargando = false;
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  abrirMapaSucursal(target: string): void {
    if (!this.googleMapsApiKey) {
      Swal.fire({
        icon: 'warning',
        title: 'Google Maps no configurado',
        text: 'Configura una clave de API de Google Maps para usar el mapa.',
        confirmButtonColor: '#1f6feb'
      });
      return;
    }
    this.mapTargetKey = target;
    this.mapAbierto = true;
    this.cargarGoogleMaps().then(() => {
      setTimeout(() => this.inicializarMapa(), 300);
    });
  }

  private inicializarMapa(): void {
    const target = this.obtenerObjetivoMapa();
    const elId = this.mapTargetKey === 'temporal' ? 'map-container-temporal' : 'map-container-individual';
    const el = document.getElementById(elId);
    if (!el || typeof google === 'undefined' || !google.maps) return;

    const lat = target?.latitud || -12.0464;
    const lng = target?.longitud || -77.0428;
    const centro = { lat, lng };

    this.map = new google.maps.Map(el, {
      center: centro,
      zoom: 16,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    this.marker = new google.maps.Marker({
      position: centro,
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      title: 'Arrástrame para ajustar la ubicación'
    });

    google.maps.event.addListener(this.marker, 'dragend', () => {
      const pos = this.marker.getPosition();
      this.actualizarCoordenadas(pos.lat(), pos.lng());
    });

    this.map.addListener('click', (e: any) => {
      this.marker.setPosition(e.latLng);
      this.actualizarCoordenadas(e.latLng.lat(), e.latLng.lng());
    });
  }

  private actualizarCoordenadas(lat: number, lng: number): void {
    const target = this.obtenerObjetivoMapa();
    if (target) {
      target.latitud = parseFloat(lat.toFixed(6));
      target.longitud = parseFloat(lng.toFixed(6));
    }
  }

  cerrarMapa(): void {
    this.mapAbierto = false;
    this.mapTargetKey = '';
    this.map = null;
    this.marker = null;
  }
}
