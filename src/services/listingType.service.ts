import { PrismaClient, ListingType } from '@prisma/client';
import { createListingTypeSchema, updateListingTypeSchema } from '@/validations/listingType.validation';
import { z } from 'zod';

const prisma = new PrismaClient();

export const listingTypeService = {
  /**
   * Crear un nuevo tipo de listado
   */
  async createListingType(data: z.infer<typeof createListingTypeSchema>): Promise<ListingType> {
    return prisma.listingType.create({
      data
    });
  },

  /**
   * Obtener todos los tipos de listado
   */
  async getAllListingTypes(): Promise<ListingType[]> {
    return prisma.listingType.findMany({
      orderBy: {
        id: 'asc'
      }
    });
  },

  /**
   * Obtener un tipo de listado por ID
   */
  async getListingTypeById(id: number): Promise<ListingType | null> {
    return prisma.listingType.findUnique({
      where: { id }
    });
  },

  /**
   * Actualizar un tipo de listado
   */
  async updateListingType(
    id: number, 
    data: z.infer<typeof updateListingTypeSchema>
  ): Promise<ListingType> {
    return prisma.listingType.update({
      where: { id },
      data
    });
  },

  /**
   * Eliminar un tipo de listado
   */
  async deleteListingType(id: number): Promise<ListingType> {
    return prisma.listingType.delete({
      where: { id }
    });
  }
}; 