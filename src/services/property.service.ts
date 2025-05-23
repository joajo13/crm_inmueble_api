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
  buildingId?: number; // Nueva relación directa con edificio
  // Para propiedades adicionales
  [key: string]: any;
}

const PropertyService = {
  getAll: async () => {
    return await prisma.property.findMany({
      include: {
        building: true
      }
    });
  },
  
  getById: async (id: number) => {
    return await prisma.property.findUnique({ 
      where: { id },
      include: {
        building: true
      }
    });
  },
  
  create: async (data: PropertyData) => {
    const createData: any = {
      title: data.title,
      description: data.description,
      price: data.price,
      listingType: { connect: { id: data.listingTypeId } },
      status: { connect: { id: data.statusId } },
      propertyType: { connect: { id: data.propertyTypeId } },
      address: { connect: { id: data.addressId } }
    };
    
    // Si tiene un edificio asociado
    if (data.buildingId) {
      createData.building = { connect: { id: data.buildingId } };
    }
    
    return await prisma.property.create({
      data: createData,
      include: {
        building: true
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
    if (data.buildingId !== undefined) {
      if (data.buildingId === null) {
        updateData.building = { disconnect: true };
      } else {
        updateData.building = { connect: { id: data.buildingId } };
      }
    }
    
    return await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        building: true
      }
    });
  },
  
  delete: async (id: number) => {
    // Primero eliminamos las relaciones en UserOnProperty
    await prisma.userOnProperty.deleteMany({
      where: { propertyId: id }
    });
    
    // Luego eliminamos la propiedad
    return await prisma.property.delete({
      where: { id }
    });
  },
  
  // Método para obtener propiedades por edificio
  getPropertiesByBuilding: async (buildingId: number) => {
    return await prisma.property.findMany({
      where: { buildingId },
      include: {
        building: true
      }
    });
  }
};

export default PropertyService; 