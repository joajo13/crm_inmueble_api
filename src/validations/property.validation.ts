import { z } from 'zod';

// Esquema principal de propiedades alineado con Prisma y el servicio
export const propertySchema = z.object({
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres' }),
  description: z.string().optional().nullable(),
  price: z.number().positive({ message: 'El precio debe ser un valor positivo' }),
  currency: z.string().default('ARS'),
  
  // Datos de geolocalización (opcionales)
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  
  // Características físicas (opcionales)
  coveredAreaM2: z.number().optional().nullable(),
  totalAreaM2: z.number().optional().nullable(),
  bedrooms: z.number().int().optional().nullable(),
  bathrooms: z.number().int().optional().nullable(),
  floors: z.number().int().optional().nullable(),
  yearBuilt: z.number().int().optional().nullable(),
  garages: z.number().int().optional().nullable(),

  // IDs para las relaciones (requeridos)
  listingTypeId: z.number().int().positive({ message: 'El tipo de listado es requerido' }),
  statusId: z.number().int().positive({ message: 'El estado de la propiedad es requerido' }),
  propertyTypeId: z.number().int().positive({ message: 'El tipo de propiedad es requerido' }),
  addressId: z.number().int().positive({ message: 'La dirección es requerida' }),
  
  // Relaciones opcionales
  agentId: z.number().int().optional().nullable(),
  buildingId: z.number().int().optional().nullable(),
});

// Esquema para crear propiedades
export const createPropertySchema = propertySchema;

// Esquema para actualizar propiedades (todos los campos son opcionales)
export const updatePropertySchema = propertySchema.partial();

// Validación para parámetros de ID
export const propertyIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: 'ID de propiedad inválido' })
});

// Validación para parámetros de buildingId
export const propertyBuildingIdParamSchema = z.object({
  buildingId: z.string().regex(/^\d+$/, { message: 'ID de edificio inválido' })
}); 