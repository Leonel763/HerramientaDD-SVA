import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareaOperativaService } from '../../../services/tarea-operativa.service';
import { CloudinaryService } from '../../../services/cloudinary.service'; 
import { TareaOperativa } from '../../../models/tarea-operativa';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-tarea-trabajador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarea-trabajador.html',
  styleUrl: './tarea-trabajador.css'
})
export class TareaTrabajador implements OnInit {

  dniTrabajador: string = '';
  nombreTrabajador: string = '';
  tareas: TareaOperativa[] = [];
  
  tareaSeleccionadaId: number | null = null;
  inputUrlEvidencia: string = '';
  inputObservaciones: string = '';
  
  archivoSeleccionado: File | null = null;
  isSubiendo: boolean = false;

  gpsCoords: { latitud: number; longitud: number; precision: number } | null = null;
  gpsStatus: 'no_disponible' | 'buscando' | 'capturado' | 'error' = 'no_disponible';

  mapAbierto: boolean = false;
  googleMapsCargado: boolean = false;
  googleMapsCargando: boolean = false;
  map: any = null;
  marker: any = null;
  coordsMapa: { latitud: number; longitud: number } | null = null;
  private readonly googleMapsApiKey: string = 'AIzaSyDEXQW3tiUGqvZ78FqxYG5oHPicMlfq1ek';

  constructor(
    private tareaOperativaService: TareaOperativaService,
    private cloudinaryService: CloudinaryService 
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.dniTrabajador = localStorage.getItem('username') || ''; 
      this.nombreTrabajador = localStorage.getItem('nombre') || 'Operario';
    }
    this.cargarMisTareas();
  }

  cargarMisTareas(): void {
    if (!this.dniTrabajador) return;

    this.tareaOperativaService.listarPorTrabajador(this.dniTrabajador).subscribe({
      next: (data: TareaOperativa[]) => {
        this.tareas = data
          .filter((t) => t.estado !== 'APROBADO')
          .sort((a, b) => b.fecha.localeCompare(a.fecha));
      },
      error: (err) => console.error('Error al obtener tareas del operario:', err)
    });
  }

  abrirModalEvidencia(id: number | undefined): void {
    if (id === undefined) return;
    this.tareaSeleccionadaId = id;
    this.inputUrlEvidencia = '';
    this.inputObservaciones = '';
    this.archivoSeleccionado = null; 
    this.isSubiendo = false;
    this.gpsCoords = null;
    this.gpsStatus = 'buscando';
    this.capturarUbicacion();
    if (typeof window !== 'undefined') {
      document.body.classList.add('modal-open');
    }
  }

  cerrarModalEvidencia(): void {
    this.tareaSeleccionadaId = null;
    if (typeof window !== 'undefined') {
      document.body.classList.remove('modal-open');
    }
  }

  capturarUbicacion(): void {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      this.gpsStatus = 'no_disponible';
      return;
    }
    this.gpsStatus = 'buscando';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.gpsCoords = {
          latitud: pos.coords.latitude,
          longitud: pos.coords.longitude,
          precision: pos.coords.accuracy
        };
        this.gpsStatus = 'capturado';
      },
      () => {
        this.gpsStatus = 'error';
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  private cargarGoogleMaps(): Promise<void> {
    return new Promise((resolve) => {
      if ((typeof google !== 'undefined' && google.maps) || !this.googleMapsApiKey) {
        this.googleMapsCargado = typeof google !== 'undefined' && !!google.maps;
        resolve();
        return;
      }
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        const check = setInterval(() => {
          if (typeof google !== 'undefined' && google.maps) {
            clearInterval(check);
            this.googleMapsCargado = true;
            resolve();
          }
        }, 200);
        return;
      }
      this.googleMapsCargando = true;
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.googleMapsCargado = true;
        this.googleMapsCargando = false;
        resolve();
      };
      script.onerror = () => {
        this.googleMapsCargando = false;
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  async abrirMapa(): Promise<void> {
    if (!this.googleMapsApiKey) {
      Swal.fire({
        icon: 'warning',
        title: 'Google Maps no configurado',
        text: 'Configura una clave de API de Google Maps para usar el mapa.',
        confirmButtonColor: '#1f6feb'
      });
      return;
    }
    this.mapAbierto = true;
    await this.cargarGoogleMaps();
    setTimeout(() => this.inicializarMapa(), 300);
  }

  private inicializarMapa(): void {
    const el = document.querySelector('#map-container-evidence');
    if (!el || typeof google === 'undefined' || !google.maps) return;
    const tarea = this.tareas.find(t => t.id === this.tareaSeleccionadaId);
    const centroSucursal = tarea?.sucursal?.latitud && tarea?.sucursal?.longitud
      ? { lat: tarea.sucursal.latitud, lng: tarea.sucursal.longitud }
      : null;
    const centroGps = this.gpsCoords
      ? { lat: this.gpsCoords.latitud, lng: this.gpsCoords.longitud }
      : null;
    const centro = centroSucursal || centroGps || { lat: -12.0464, lng: -77.0428 };

    this.map = new google.maps.Map(el, {
      center: centro,
      zoom: 16,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }
      ]
    });

    this.marker = new google.maps.Marker({
      position: centro,
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      title: 'Arrástrame para ajustar la ubicación'
    });

    this.coordsMapa = { latitud: centro.lat, longitud: centro.lng };

    google.maps.event.addListener(this.marker, 'dragend', () => {
      const pos = this.marker.getPosition();
      this.coordsMapa = { latitud: pos.lat(), longitud: pos.lng() };
    });

    this.map.addListener('click', (e: any) => {
      this.marker.setPosition(e.latLng);
      this.coordsMapa = { latitud: e.latLng.lat(), longitud: e.latLng.lng() };
    });
  }

  cerrarMapa(): void {
    this.mapAbierto = false;
    this.coordsMapa = null;
    this.map = null;
    this.marker = null;
  }

  confirmarUbicacionMapa(): void {
    if (!this.coordsMapa) return;
    this.gpsCoords = {
      latitud: this.coordsMapa.latitud,
      longitud: this.coordsMapa.longitud,
      precision: 10
    };
    this.gpsStatus = 'capturado';
    this.mapAbierto = false;
    this.map = null;
    this.marker = null;
  }

  onFotoCapturada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'warning',
        title: 'Formato inválido',
        text: 'Por favor, captura o selecciona un archivo de imagen válido.',
        confirmButtonColor: '#1f6feb'
      });
      return;
    }

    this.archivoSeleccionado = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.inputUrlEvidencia = reader.result as string;
    };
    reader.onerror = (error) => {
      console.error('Error al procesar la imagen de la cámara:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error de lectura',
        text: 'Ocurrió un problema al cargar la fotografía localmente.',
        confirmButtonColor: '#1f6feb'
      });
    };

    reader.readAsDataURL(file);
  }

  onEnviarEvidencia(): void {
    if (!this.tareaSeleccionadaId || !this.archivoSeleccionado) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Falta la fotografía',
        text: 'Por favor, captura la foto de evidencia antes de enviar.',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
      return;
    }

    if (!this.gpsCoords) {
      this.capturarUbicacion();
      if (this.gpsStatus === 'buscando') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'info',
          title: 'Obteniendo ubicación...',
          text: 'Espera unos segundos mientras capturamos tu ubicación GPS.',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        setTimeout(() => {
          if (this.gpsCoords) {
            this.confirmarEnvio();
          } else {
            Swal.fire({
              title: '¿Enviar sin ubicación?',
              text: 'No se pudo obtener tu ubicación GPS. El reporte se enviará igual pero quedará pendiente de validación manual.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#1f6feb',
              cancelButtonColor: '#6c757d',
              confirmButtonText: 'Sí, enviar igual',
              cancelButtonText: 'Esperar'
            }).then((r) => {
              if (r.isConfirmed) this.procesarSubidaNube();
            });
          }
        }, 3000);
        return;
      }
    }

    this.confirmarEnvio();
  }

  private confirmarEnvio(): void {
    Swal.fire({
      title: '¿Confirmar envío?',
      text: 'Asegúrate de que la foto sea clara. Una vez enviada, pasará a revisión gerencial.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1f6feb',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, enviar reporte',
      cancelButtonText: 'Revisar foto'
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesarSubidaNube();
      }
    });
  }

  private procesarSubidaNube(): void {
    this.isSubiendo = true; 

    Swal.fire({
      title: 'Subiendo evidencia...',
      html: 'Por favor espera, no cierres esta ventana.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.cloudinaryService.subirImagen(this.archivoSeleccionado!).subscribe({
      next: (secureUrl) => {
        this.tareaOperativaService.subirEvidencia(
          this.tareaSeleccionadaId!, secureUrl, this.inputObservaciones,
          this.gpsCoords?.latitud, this.gpsCoords?.longitud, this.gpsCoords?.precision
        ).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Reporte Enviado!',
              text: 'Tu evidencia ha sido registrada y está pendiente de validación.',
              confirmButtonColor: '#1f6feb',
              timer: 3000
            });
            this.cerrarModalEvidencia();
            this.cargarMisTareas();
            this.isSubiendo = false;
          },
          error: (err) => {
            console.error('Error en Spring Boot:', err);
            const msg = err.error?.mensaje || err.error || err.message || 'No se pudo guardar la tarea en la base de datos.';
            Swal.fire({
              icon: 'error',
              title: 'Error del Servidor',
              text: msg,
              confirmButtonColor: '#1f6feb'
            });
            this.isSubiendo = false;
          }
        });
      },
      error: (err) => {
        console.error('Error en Cloudinary:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error de Red',
          text: 'Hubo un problema subiendo la foto a la nube. Inténtalo de nuevo.',
          confirmButtonColor: '#1f6feb'
        });
        this.isSubiendo = false;
      }
    });
  }
  
  limpiarEvidencia(): void {
    this.inputUrlEvidencia = '';
    this.archivoSeleccionado = null;
  }
}
