import { Sucursal } from './sucursal';

export interface Cliente {
  id?: number;
  ruc: string;
  razonSocial: string;
  sucursales?: Sucursal[];
}
