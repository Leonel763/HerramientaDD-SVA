import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareaOperativaService } from '../../../services/tarea-operativa.service';
import { TrabajadorService } from '../../../services/trabajador.service';
import { EmpresaService } from '../../../services/empresa.service';
import { Usuario } from '../../../models/usuario';
import { Cliente } from '../../../models/cliente';
import { Sucursal } from '../../../models/sucursal';
import { TareaOperativa as TareaOperativaModel } from '../../../models/tarea-operativa';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tarea-operativa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarea-operativa.html',
  styleUrl: './tarea-operativa.css'
})
export class TareaOperativa implements OnInit {

  fechaSeleccionada: string = '';
  empresaSeleccionadaId: number | null = null;
  sucursalSeleccionadaId: number | null = null;

  turnoSeleccionado: string = 'DIA';
  horasAsignadas: string = '12';
  tipoPuestoSeleccionado: string = 'SALA';

  listaUsuarios: (Usuario & { seleccionado?: boolean })[] = [];
  listaEmpresas: Cliente[] = [];
  sucursalesFiltradas: Sucursal[] = [];
  tareasCreadasDelDia: TareaOperativaModel[] = [];

  tiposPuesto: string[] = [
    'OBRAS', 'SALAS_DE_VENTA', 'ALMACENES', 'FABRICAS',
    'RESTAURANTES', 'GRIFOS', 'EDIFICIOS', 'EVENTOS', 'SALA'
  ];

  constructor(
    private tareaOperativaService: TareaOperativaService,
    private trabajadorService: TrabajadorService,
    private empresaService: EmpresaService
  ) { }

  ngOnInit(): void {
    const hoy = new Date();
    this.fechaSeleccionada = hoy.toISOString().split('T')[0];
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.trabajadorService.listarTodo().subscribe({
      next: (data: Usuario[]) => {
        this.listaUsuarios = data
          .filter((u: Usuario) => u.rol === 'TRABAJADOR')
          .map((u: Usuario) => ({ ...u, seleccionado: false }));
      },
      error: (err) => console.error('Error al cargar operarios:', err)
    });

    this.empresaService.listarTodo().subscribe({
      next: (data: Cliente[]) => this.listaEmpresas = data,
      error: (err) => console.error('Error al cargar empresas:', err)
    });
  }

  onEmpresaChange(): void {
    this.sucursalSeleccionadaId = null;
    const empresa = this.listaEmpresas.find(e => e.id === Number(this.empresaSeleccionadaId));
    this.sucursalesFiltradas = empresa && empresa.sucursales ? empresa.sucursales : [];
    this.tareasCreadasDelDia = [];
  }

  cargarTareasDelDia(): void {
    if (!this.fechaSeleccionada || !this.sucursalSeleccionadaId) {
      this.tareasCreadasDelDia = [];
      return;
    }

    this.tareaOperativaService.listarParaRevision(this.fechaSeleccionada).subscribe({
      next: (data: TareaOperativaModel[]) => {
        this.tareasCreadasDelDia = data.filter((t: TareaOperativaModel) => t.sucursal?.id === Number(this.sucursalSeleccionadaId));
      },
      error: (err) => console.error('Error al cargar tareas diarias:', err)
    });
  }

  toggleTodosLosTrabajadores(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.listaUsuarios.forEach(u => u.seleccionado = checked);
  }

  onCrearTareaMasiva(): void {
    if (!this.sucursalSeleccionadaId || !this.fechaSeleccionada) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, selecciona la Empresa, la Sede Local y la Fecha de Operación.',
        confirmButtonColor: '#1f6feb'
      });
      return;
    }

    const seleccionados = this.listaUsuarios.filter(u => u.seleccionado);

    if (seleccionados.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin personal seleccionado',
        text: 'Debes marcar al menos un operario de la lista para asignar la tarea.',
        confirmButtonColor: '#1f6feb'
      });
      return;
    }

    Swal.fire({
      title: 'Programando Operarios...',
      text: 'Por favor, espera mientras se genera la planilla del día.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    let completados = 0;
    let errores = 0;

    seleccionados.forEach(trabajador => {
      const nuevaTarea = {
        fecha: this.fechaSeleccionada,
        turno: this.turnoSeleccionado,
        horasAsignadas: this.horasAsignadas,
        tipoPuesto: this.tipoPuestoSeleccionado,
        estado: 'PENDIENTE',
        usuario: { dni: trabajador.dni } as Usuario,
        sucursal: { id: Number(this.sucursalSeleccionadaId) } as Sucursal
      } as TareaOperativaModel;

      this.tareaOperativaService.asignarTarea(nuevaTarea).subscribe({
        next: () => {
          completados++;
          this.verificarFinAsignacion(completados, errores, seleccionados.length);
        },
        error: (err) => {
          console.error(err);
          errores++;
          completados++;
          this.verificarFinAsignacion(completados, errores, seleccionados.length);
        }
      });
    });
  }

  private verificarFinAsignacion(actual: number, errores: number, total: number): void {
    if (actual === total) {
      if (errores === 0) {
        Swal.fire({
          icon: 'success',
          title: 'Asignación Completada',
          text: 'Todas las tareas operativas fueron asignadas con éxito al grupo seleccionado.',
          confirmButtonColor: '#1f6feb',
          timer: 2000
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Asignación Finalizada',
          text: `Se programaron los operarios, pero hubo ${errores} error(es) en el proceso.`,
          confirmButtonColor: '#1f6feb'
        });
      }
      this.limpiarSeleccion();
      this.cargarTareasDelDia();
    }
  }

  limpiarSeleccion(): void {
    this.listaUsuarios.forEach(u => u.seleccionado = false);
    const checkTodos = document.getElementById('checkTodos') as HTMLInputElement;
    if (checkTodos) {
      checkTodos.checked = false;
    }
  }
}
