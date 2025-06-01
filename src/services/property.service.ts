import { PrismaClient, Prisma } from '@prisma/client';
import { addressService } from './address.service';

const prisma = new PrismaClient();

// Interfaz para datos de propiedad según el modelo de Prisma
export interface PropertyData {
  title: string;
  description?: string | null;
  price: number;
  currency?: string;
  
  // IDs para las relaciones
  listingTypeId: number;
  statusId: number;
  propertyTypeId: number;
  addressId: number;
  buildingId?: number | null;
  agentId?: number | null;
  
  // Datos de geolocalización
  lat?: number | null;
  lng?: number | null;
  
  // Características físicas
  coveredAreaM2?: number | null;
  totalAreaM2?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floors?: number | null;
  yearBuilt?: number | null;
  garages?: number | null;
}

const PropertyService = {
  getAll: async () => {
    return await prisma.property.findMany({
      include: {
        building: true,
        address: true,
        propertyType: true,
        listingType: true,
        status: true,
        images: true
      }
    });
  },
  
  getById: async (id: number) => {
    return await prisma.property.findUnique({ 
      where: { id },
      include: {
        building: true,
        address: true,
        propertyType: true,
        listingType: true,
        status: true,
        agent: true,
        images: true
      }
    });
  },
  
  create: async (data: any) => {
    const { address, images, ...propertyData } = data; // Extraer images también

    return prisma.$transaction(async (tx) => {
      // 1. Buscar o crear dirección
      let addressRecord = await addressService.findAddressByFields(address, tx as PrismaClient);
      if (!addressRecord) {
        addressRecord = await addressService.createAddress(address, tx as PrismaClient);
      }

      // 2. Preparar datos de la propiedad
      const createPropertyData: Prisma.PropertyCreateInput = {
        title: propertyData.title,
        description: propertyData.description,
        price: new Prisma.Decimal(propertyData.price.toString()),
        currency: propertyData.currency || 'ARS',
        listingType: { connect: { id: propertyData.listingTypeId } },
        status: { connect: { id: propertyData.statusId } },
        propertyType: { connect: { id: propertyData.propertyTypeId } },
        address: { connect: { id: addressRecord.id } },
        coveredAreaM2: propertyData.coveredAreaM2,
        totalAreaM2: propertyData.totalAreaM2,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        floors: propertyData.floors,
        yearBuilt: propertyData.yearBuilt,
        garages: propertyData.garages,
        lat: propertyData.lat ? new Prisma.Decimal(propertyData.lat.toString()) : null,
        lng: propertyData.lng ? new Prisma.Decimal(propertyData.lng.toString()) : null,
      };
      if (propertyData.buildingId) {
        createPropertyData.building = { connect: { id: propertyData.buildingId } };
      }
      if (propertyData.agentId) {
        createPropertyData.agent = { connect: { id: propertyData.agentId } };
      }

      // 3. Crear la propiedad
      const newProperty = await tx.property.create({
        data: createPropertyData,
        include: {
            // Incluimos todo para la respuesta, especialmente las imágenes vacías inicialmente
            building: true,
            address: true,
            propertyType: true,
            listingType: true,
            status: true,
            agent: true,
            images: true 
        }
      });

      // 4. Si hay imágenes, crearlas y asociarlas
      if (images && images.length > 0) {
        const imageCreations = images.map((img: { filePath: string; mimeType: string }) => {
          return tx.image.create({
            data: {
              filePath: img.filePath,
              mimeType: img.mimeType,
              Property: { connect: { id: newProperty.id } }
            }
          });
        });
        await Promise.all(imageCreations);
      }
      
      // 5. Volver a cargar la propiedad con las imágenes para devolverla completa
      return tx.property.findUnique({
        where: { id: newProperty.id },
        include: {
            building: true,
            address: true,
            propertyType: true,
            listingType: true,
            status: true,
            agent: true,
            images: true // Ahora debería incluir las imágenes creadas
        }
      });
    });
  },
  
  update: async (id: number, data: Partial<PropertyData>) => {
    const updateData: Prisma.PropertyUpdateInput = {};
    
    // Campos básicos
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = new Prisma.Decimal(data.price.toString());
    if (data.currency !== undefined) updateData.currency = data.currency;
    
    // Relaciones
    if (data.listingTypeId !== undefined) updateData.listingType = { connect: { id: data.listingTypeId } };
    if (data.statusId !== undefined) updateData.status = { connect: { id: data.statusId } };
    if (data.propertyTypeId !== undefined) updateData.propertyType = { connect: { id: data.propertyTypeId } };
    if (data.addressId !== undefined) updateData.address = { connect: { id: data.addressId } };
    
    // Características físicas
    if (data.coveredAreaM2 !== undefined) updateData.coveredAreaM2 = data.coveredAreaM2;
    if (data.totalAreaM2 !== undefined) updateData.totalAreaM2 = data.totalAreaM2;
    if (data.bedrooms !== undefined) updateData.bedrooms = data.bedrooms;
    if (data.bathrooms !== undefined) updateData.bathrooms = data.bathrooms;
    if (data.floors !== undefined) updateData.floors = data.floors;
    if (data.yearBuilt !== undefined) updateData.yearBuilt = data.yearBuilt;
    if (data.garages !== undefined) updateData.garages = data.garages;
    
    // Datos de geolocalización
    if (data.lat !== undefined) {
      updateData.lat = data.lat ? new Prisma.Decimal(data.lat.toString()) : null;
    }
    if (data.lng !== undefined) {
      updateData.lng = data.lng ? new Prisma.Decimal(data.lng.toString()) : null;
    }
    
    // Relaciones opcionales
    if (data.buildingId !== undefined) {
      if (data.buildingId === null) {
        updateData.building = { disconnect: true };
      } else {
        updateData.building = { connect: { id: data.buildingId } };
      }
    }
    
    if (data.agentId !== undefined) {
      if (data.agentId === null) {
        updateData.agent = { disconnect: true };
      } else {
        updateData.agent = { connect: { id: data.agentId } };
      }
    }
    
    return await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        building: true,
        address: true,
        propertyType: true,
        listingType: true,
        status: true,
        agent: true
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
        building: true,
        address: true,
        propertyType: true,
        listingType: true,
        status: true,
        agent: true
      }
    });
  },

  // Nuevo método para agregar una imagen a una propiedad
  addImageToProperty: async (propertyId: number, imageData: { filePath: string; mimeType: string }) => {
    return await prisma.image.create({
      data: {
        filePath: imageData.filePath,
        mimeType: imageData.mimeType,
        Property: { connect: { id: propertyId } }
      }
    });
  }
};

export default PropertyService; 