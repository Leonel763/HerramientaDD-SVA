import { Cliente } from './cliente';

export interface Sucursal {
  id?: number;
  nombreSucursal: string;
  direccion: string;
  cliente?: Cliente;
}
