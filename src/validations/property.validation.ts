import { z } from 'zod';
import { addressSchema } from './address.validation';

// Esquema principal de propiedades alineado con Prisma y el servicio
export const propertySchema = z.object({
  title: z.string().min(3, { message: 'El título debe tener al menos 3 caracteres' }),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive({ message: 'El precio debe ser un valor positivo' }),
  currency: z.string().default('ARS'),
  
  // Datos de geolocalización (opcionales)
  lat: z.coerce.number().optional().nullable(),
  lng: z.coerce.number().optional().nullable(),
  
  // Características físicas (opcionales)
  coveredAreaM2: z.coerce.number().optional().nullable(),
  totalAreaM2: z.coerce.number().optional().nullable(),
  bedrooms: z.coerce.number().int().optional().nullable(),
  bathrooms: z.coerce.number().int().optional().nullable(),
  floors: z.coerce.number().int().optional().nullable(),
  yearBuilt: z.coerce.number().int().optional().nullable(),
  garages: z.coerce.number().int().optional().nullable(),

  // IDs para las relaciones (requeridos)
  listingTypeId: z.coerce.number().int().positive({ message: 'El tipo de listado es requerido' }),
  statusId: z.coerce.number().int().positive({ message: 'El estado de la propiedad es requerido' }),
  propertyTypeId: z.coerce.number().int().positive({ message: 'El tipo de propiedad es requerido' }),
  addressId: z.coerce.number().int().positive({ message: 'La dirección es requerida' }),
  
  // Relaciones opcionales
  agentId: z.coerce.number().int().optional().nullable(),
  buildingId: z.coerce.number().int().optional().nullable(),
});

// Esquema para crear propiedades (usa addressSchema en vez de addressId)
export const createPropertySchema = propertySchema.omit({ addressId: true }).extend({
  address: z.string().transform((str) => {
    try {
      const parsedAddress = JSON.parse(str);
      return addressSchema.parse(parsedAddress);
    } catch (error) {
      throw new Error('El formato de la dirección no es válido');
    }
  }),
});

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