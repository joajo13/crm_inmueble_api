import { z } from 'zod';

export const buildingCreateSchema = z.object({
  name: z.string().min(1, { message: 'Nombre es requerido' }),
  addressId: z.number().int().positive({ message: 'Dirección es requerida' }),
  yearBuilt: z.number().int().optional(),
  floors: z.number().int().optional(),
  totalUnits: z.number().int().optional(),
  lat: z.number().optional(),
  lng: z.number().optional()
});

export const buildingIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: 'ID de edificio inválido' })
});

export const buildingUpdateSchema = buildingCreateSchema.partial(); 