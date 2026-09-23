export interface ApiResponse<T> {
  error: boolean;
  message: string;
  data: T;
}

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
  estado: boolean;
  fechaCreacion: string;
}

export interface UsuarioCreatePayload {
  nombre: string;
  apellido: string;
  correo: string;
  clave: string;
  rol: string;
  estado: boolean;
}

export interface UsuarioUpdatePayload {
  nombre: string;
  apellido: string;
  correo: string;
  rol: string;
}

export interface UserFilterParams {
  buscar?: string;
  rol?: string;
  estado?: boolean;
}