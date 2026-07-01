export interface Usuario {
  dni: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  sueldoBase: number;
  rol: string;
  banco?: string;
  numeroCuenta?: string;
  password?: string;
}
