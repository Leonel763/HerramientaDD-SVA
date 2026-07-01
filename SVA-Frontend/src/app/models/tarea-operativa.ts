import { Usuario } from './usuario';
import { Sucursal } from './sucursal';
import { TipoPuesto } from './tipo-puesto';

export interface TareaOperativa {
  id?: number;
  fecha: string;
  turno: string;
  horasAsignadas: string;
  tipoPuesto: TipoPuesto | string;
  estado: string;
  urlEvidencia?: string;
  observaciones?: string;
  usuario: Usuario;
  sucursal: Sucursal;
}
