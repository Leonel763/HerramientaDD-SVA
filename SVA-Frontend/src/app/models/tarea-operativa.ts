import { Usuario } from './usuario';
import { Sucursal } from './sucursal';
import { TipoPuesto } from './tipo-puesto';

export interface TareaOperativa {
  id?: number;
  fecha: string;
  turno: string;
  horasAsignadas: string;
  horaInicio?: string;
  horaFin?: string;
  toleranciaMinutos?: number;
  tipoPuesto: TipoPuesto | string;
  estado: string;
  urlEvidencia?: string;
  observaciones?: string;
  gpsLat?: number;
  gpsLng?: number;
  gpsAccuracy?: number;
  horaAsistencia?: string;
  asistencia?: string;
  usuario: Usuario;
  sucursal: Sucursal;
}
