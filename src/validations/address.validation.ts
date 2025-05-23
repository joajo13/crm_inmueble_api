import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().min(3, { message: 'La calle debe tener al menos 3 caracteres' }),
  number: z.string().optional().nullable(),
  city: z.string().min(2, { message: 'La ciudad debe tener al menos 2 caracteres' }),
  province: z.string().min(2, { message: 'La provincia debe tener al menos 2 caracteres' }),
  postalCode: z.string().optional().nullable(),
  extraInfo: z.string().optional().nullable(),
});

// Esquema para crear direcciones
export const createAddressSchema = addressSchema;

// Esquema para actualizar direcciones (todos los campos son opcionales)
export const updateAddressSchema = addressSchema.partial();

// Validación para parámetros de ID
export const addressIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: 'ID de dirección inválido' })
}); 