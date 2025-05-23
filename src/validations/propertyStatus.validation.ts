import { z } from 'zod';

export const propertyStatusSchema = z.object({
  code: z.string().min(2, { message: 'El código debe tener al menos 2 caracteres' }),
  description: z.string().optional().nullable(),
});

// Esquema para crear estados de propiedad
export const createPropertyStatusSchema = propertyStatusSchema;

// Esquema para actualizar estados de propiedad (todos los campos son opcionales)
export const updatePropertyStatusSchema = propertyStatusSchema.partial();

// Validación para parámetros de ID
export const propertyStatusIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: 'ID de estado de propiedad inválido' })
}); 