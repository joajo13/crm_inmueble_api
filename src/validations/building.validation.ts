import { z } from 'zod';

export const buildingCreateSchema = z.object({
  name: z.string().min(1, { message: 'Nombre es requerido' }),
  city: z.string().min(1, { message: 'Ciudad es requerida' }),
  province: z.string().min(1, { message: 'Provincia es requerida' }),
  postalCode: z.string().min(1, { message: 'Código postal es requerido' }),
  street: z.string().min(1, { message: 'Calle es requerida' }),
  number: z.string().min(1, { message: 'Número es requerido' }),
  yearBuilt: z.coerce.number().int().optional().nullable(),
  floors: z.coerce.number().int().optional().nullable(),
  totalUnits: z.coerce.number().int().optional().nullable(),
  lat: z.coerce.number().optional().nullable(),
  lng: z.coerce.number().optional().nullable()
});

export const buildingIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: 'ID de edificio inválido' })
});

export const buildingUpdateSchema = buildingCreateSchema.partial(); 