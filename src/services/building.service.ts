import { PrismaClient, Building } from '@prisma/client';

const prisma = new PrismaClient();

export class BuildingService {
  /**
   * Crear un nuevo edificio
   */
  async createBuilding(data: {
    name: string;
    city: string;
    province: string;
    postalCode: string;
    street: string;
    number: string;
    yearBuilt?: number;
    floors?: number;
    totalUnits?: number;
    lat?: number;
    lng?: number;
  }): Promise<Building> {
    return prisma.building.create({
      data,
      include: {
        properties: true,
      },
    });
  }

  /**
   * Obtener todos los edificios
   */
  async getAllBuildings(): Promise<Building[]> {
    return prisma.building.findMany({
      include: {
        properties: true,
        images: true,
      },
    });
  }

  /**
   * Obtener un edificio por ID
   */
  async getBuildingById(id: number): Promise<Building | null> {
    return prisma.building.findUnique({
      where: { id },
      include: {
        properties: true,
      },
    });
  }

  /**
   * Actualizar un edificio
   */
  async updateBuilding(
    id: number,
    data: {
      name?: string;
      addressId?: number;
      yearBuilt?: number;
      floors?: number;
      totalUnits?: number;
      lat?: number;
      lng?: number;
    },
  ): Promise<Building> {
    return prisma.building.update({
      where: { id },
      data,
      include: {
        properties: true,
      },
    });
  }

  /**
   * Eliminar un edificio
   */
  async deleteBuilding(id: number): Promise<Building> {
    // Primero desconectamos todas las propiedades de este edificio
    await prisma.property.updateMany({
      where: { buildingId: id },
      data: { buildingId: null },
    });
    
    return prisma.building.delete({
      where: { id },
    });
  }

  /**
   * Obtener propiedades de un edificio
   */
  async getBuildingProperties(buildingId: number) {
    return prisma.property.findMany({
      where: { buildingId },
      include: {
        building: true,
      },
    });
  }
} 