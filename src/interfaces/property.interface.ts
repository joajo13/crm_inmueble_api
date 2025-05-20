export interface PropertyDTO {
  id?: string;
  titulo: string;
  descripcion: string;
  direccion: string;
  precio: number;
  tipo: string;
  habitaciones: number;
  banos: number;
  area: number;
  creadoEn?: Date;
  actualizadoEn?: Date;
} 