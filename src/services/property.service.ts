import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Interfaz para datos de propiedad según el modelo de Prisma
export interface Property {
  title: string;
  description?: string | null;
  price: number;
  currency?: string;
  
  // IDs para las relaciones
  listingTypeId: number;
  statusId: number;
  propertyTypeId: number;
  buildingId?: number | null;
  agentId?: number | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  street?: string | null;
  number?: string | null;
  
  // Datos de geolocalización
  lat?: number | null;
  lng?: number | null;
  
  // Características físicas
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
        propertyType: true,
        listingType: true,
        status: true,
        images: true
      },
      where: {
        deletedAt: null
      }
    });
  },
  
  getById: async (id: number) => {
    return await prisma.property.findUnique({ 
      where: { id },
      include: {
        building: true,
        propertyType: true,
        listingType: true,
        status: true,
        agent: true,
        images: true
      }
    });
  },
  
  create: async (data: any) => {
    const { images, ...propertyData } = data;

    return prisma.$transaction(async (tx) => {
      const createPropertyData: Prisma.PropertyCreateInput = {
        title: propertyData.title,
        description: propertyData.description,
        price: new Prisma.Decimal(propertyData.price.toString()),
        currency: propertyData.currency || 'ARS',
        listingType: { connect: { id: propertyData.listingTypeId } },
        status: { connect: { id: propertyData.statusId } },
        propertyType: { connect: { id: propertyData.propertyTypeId } },
        totalAreaM2: propertyData.totalAreaM2,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        city: propertyData.city,
        province: propertyData.province,
        postalCode: propertyData.postalCode,
        street: propertyData.street,
        number: propertyData.number,
        floors: propertyData.floors,
        yearBuilt: propertyData.yearBuilt,
        garages: propertyData.garages,
        lat: propertyData.lat ? new Prisma.Decimal(propertyData.lat.toString()) : null,
        lng: propertyData.lng ? new Prisma.Decimal(propertyData.lng.toString()) : null,
      };

      if (propertyData.buildingId) createPropertyData.building = { connect: { id: propertyData.buildingId } };
      if (propertyData.agentId) createPropertyData.agent = { connect: { id: propertyData.agentId } };

      const newProperty = await tx.property.create({
        data: createPropertyData,
        include: {
            building: true,
            propertyType: true,
            listingType: true,
            status: true,
            agent: true,
            images: true 
        }
      });

      // Si hay imágenes, crearlas y asociarlas
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
      
      // Devolver la propiedad con las imágenes para devolverla completa
      return tx.property.findUnique({
        where: { id: newProperty.id },
        include: {
            building: true,
            propertyType: true,
            listingType: true,
            status: true,
            agent: true,
            images: true
        }
      });
    });
  },
  
  update: async (id: number, data: Partial<Property>) => {
    const updateData: Prisma.PropertyUpdateInput = {};
    
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = new Prisma.Decimal(data.price.toString());
    if (data.currency !== undefined) updateData.currency = data.currency;

    if (data.listingTypeId !== undefined) updateData.listingType = { connect: { id: data.listingTypeId } };
    if (data.statusId !== undefined) updateData.status = { connect: { id: data.statusId } };
    if (data.propertyTypeId !== undefined) updateData.propertyType = { connect: { id: data.propertyTypeId } };
    
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
    
    if (data.city !== undefined) updateData.city = data.city;
    if (data.province !== undefined) updateData.province = data.province;
    if (data.postalCode !== undefined) updateData.postalCode = data.postalCode;
    if (data.street !== undefined) updateData.street = data.street;
    if (data.number !== undefined) updateData.number = data.number;

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

    console.log('updateData', updateData);
    
    return await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        building: true,
        propertyType: true,
        listingType: true,
        status: true,
        agent: true
      }
    });
  },
  
  delete: async (id: number) => {
    // // Primero eliminamos las relaciones en UserOnProperty
    // await prisma.userOnProperty.deleteMany({
    //   where: { propertyId: id }
    // });
    
    // // Luego eliminamos la propiedad
    // return await prisma.property.delete({
    //   where: { id }
    // });

    return await prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  },
  
  // Método para obtener propiedades por edificio
  getPropertiesByBuilding: async (buildingId: number) => {
    return await prisma.property.findMany({
      where: { buildingId },
      include: {
        building: true,
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
  },

  deleteImage: async (imageId: number) => {
    return await prisma.image.delete({
      where: { id: imageId }
    });
  },

  getImagesByPropertyId: async (propertyId: number) => {
    return await prisma.image.findMany({
      where: { propertyId }
    });
  }
};

export default PropertyService; 