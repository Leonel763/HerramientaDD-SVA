import { Cliente } from './cliente';

export interface Sucursal {
  id?: number;
  nombreSucursal: string;
  direccion: string;
  latitud?: number;
  longitud?: number;
  radioPermitido?: number;
  cliente?: Cliente;
}
