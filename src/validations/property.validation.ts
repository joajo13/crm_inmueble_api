import { z } from 'zod';

export const propertySchema = z.object({
  titulo: z.string().min(3),
  descripcion: z.string().min(10),
  direccion: z.string().min(5),
  precio: z.number().positive(),
  tipo: z.string(),
  habitaciones: z.number().int().min(1),
  banos: z.number().int().min(1),
  area: z.number().positive(),
}); 