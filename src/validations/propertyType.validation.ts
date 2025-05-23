import { z } from 'zod';

export const propertyTypeSchema = z.object({
  code: z.string().min(2, { message: 'El código debe tener al menos 2 caracteres' }),
  description: z.string().optional().nullable(),
});

// Esquema para crear tipos de propiedad
export const createPropertyTypeSchema = propertyTypeSchema;

// Esquema para actualizar tipos de propiedad (todos los campos son opcionales)
export const updatePropertyTypeSchema = propertyTypeSchema.partial();

// Validación para parámetros de ID
export const propertyTypeIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: 'ID de tipo de propiedad inválido' })
}); 