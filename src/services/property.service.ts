import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interfaz para datos de propiedad según el modelo de Prisma
export interface PropertyData {
  title: string;
  description: string;
  price: number;
  listingTypeId: number;  // IDs para las relaciones
  statusId: number;
  propertyTypeId: number;
  addressId: number; // Cambiado a obligatorio
  // Para propiedades adicionales
  [key: string]: any;
}

const PropertyService = {
  getAll: async () => {
    return await prisma.property.findMany();
  },
  
  getById: async (id: number) => {
    return await prisma.property.findUnique({ 
      where: { id }
    });
  },
  
  create: async (data: PropertyData) => {
    return await prisma.property.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        listingType: { connect: { id: data.listingTypeId } },
        status: { connect: { id: data.statusId } },
        propertyType: { connect: { id: data.propertyTypeId } },
        address: { connect: { id: data.addressId } }
      }
    });
  },
  
  update: async (id: number, data: Partial<PropertyData>) => {
    const updateData: Record<string, any> = {};
    
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.price) updateData.price = data.price;
    if (data.listingTypeId) updateData.listingType = { connect: { id: data.listingTypeId } };
    if (data.statusId) updateData.status = { connect: { id: data.statusId } };
    if (data.propertyTypeId) updateData.propertyType = { connect: { id: data.propertyTypeId } };
    if (data.addressId) updateData.address = { connect: { id: data.addressId } };
    
    return await prisma.property.update({
      where: { id },
      data: updateData
    });
  },
  
  delete: async (id: number) => {
    return await prisma.property.delete({
      where: { id }
    });
  },
};

export default PropertyService; 