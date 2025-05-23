import { z } from 'zod';

export const listingTypeSchema = z.object({
  code: z.string().min(2, { message: 'El código debe tener al menos 2 caracteres' }),
  description: z.string().optional().nullable(),
});

// Esquema para crear tipos de listado
export const createListingTypeSchema = listingTypeSchema;

// Esquema para actualizar tipos de listado (todos los campos son opcionales)
export const updateListingTypeSchema = listingTypeSchema.partial();

// Validación para parámetros de ID
export const listingTypeIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: 'ID de tipo de listado inválido' })
}); 