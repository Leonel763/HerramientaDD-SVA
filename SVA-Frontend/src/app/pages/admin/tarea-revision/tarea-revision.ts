import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareaOperativaService } from '../../../services/tarea-operativa.service';
import { EmpresaService } from '../../../services/empresa.service';
import { TareaOperativa } from '../../../models/tarea-operativa';
import { Sucursal } from '../../../models/sucursal';
import { Cliente } from '../../../models/cliente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tarea-revision',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarea-revision.html',
  styleUrl: './tarea-revision.css',
})
export class TareaRevision implements OnInit {

  fechaFiltro: string = '';
  sucursalSeleccionadaId: number | null = null;
  
  sucursales: Sucursal[] = [];

  tareasFiltradas: TareaOperativa[] = [];
  tareaEnModal: TareaOperativa | null = null;
  mostrarModal: boolean = false;

  constructor(
    private tareaService: TareaOperativaService,
    private empresaService: EmpresaService 
  ) {}

  ngOnInit(): void {
    const hoy = new Date();
    this.fechaFiltro = hoy.toISOString().split('T')[0];
    
    this.cargarSucursalesDesdeBD(); 
    this.buscarTareas(); 
  }

  cargarSucursalesDesdeBD(): void {
    this.empresaService.listarTodo().subscribe({
      next: (empresas: Cliente[]) => {
        this.sucursales = [];
        empresas.forEach((emp: Cliente) => {
          if (emp.sucursales && emp.sucursales.length > 0) {
            this.sucursales.push(...emp.sucursales);
          }
        });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  buscarTareas(): void {
    if (!this.fechaFiltro) return;

    this.tareaService.listarParaRevision(this.fechaFiltro).subscribe({
      next: (data: TareaOperativa[]) => {
        if (this.sucursalSeleccionadaId) {
          this.tareasFiltradas = data.filter((t: TareaOperativa) => t.sucursal?.id === Number(this.sucursalSeleccionadaId));
        } else {
          this.tareasFiltradas = data;
        }
      },
      error: (err) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudieron cargar las tareas para revisión.',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      }
    });
  }

  abrirModal(tarea: TareaOperativa): void {
    this.tareaEnModal = { ...tarea };
    this.mostrarModal = true;
    if (typeof window !== 'undefined') {
      document.body.classList.add('modal-open');
    }
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.tareaEnModal = null;
    if (typeof window !== 'undefined') {
      document.body.classList.remove('modal-open');
    }
  }

  calcularDistanciaGPS(lat1?: number, lng1?: number, lat2?: number, lng2?: number): number | null {
    if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return null;
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
            * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  resolver(estado: string): void {
    if (!this.tareaEnModal || !this.tareaEnModal.id) return;

    const esAprobacion = estado === 'APROBADO';

    Swal.fire({
      title: esAprobacion ? '¿Aprobar Guardia?' : '¿Rechazar Guardia?',
      text: esAprobacion ? 'El operario recibirá la validación exitosa de su asistencia.' : 'La evidencia será rechazada y se marcará como falta o incidencia.',
      icon: esAprobacion ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: esAprobacion ? '#198754' : '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: esAprobacion ? 'Sí, Aprobar' : 'Sí, Rechazar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
        Swal.fire({
          title: 'Procesando...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.tareaService.resolverTarea(this.tareaEnModal!.id!, estado).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: esAprobacion ? 'Guardia Aprobada' : 'Guardia Rechazada',
              text: `La asistencia ha sido marcada como ${estado} con éxito.`,
              confirmButtonColor: '#1f6feb',
              timer: 2000
            });
            this.cerrarModal();
            this.buscarTareas(); 
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error de Servidor',
              text: 'Ocurrió un error al actualizar el estado en la base de datos.',
              confirmButtonColor: '#1f6feb'
            });
          }
        });
      }
    });
  }
}
