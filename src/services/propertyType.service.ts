import { PrismaClient, PropertyType } from '@prisma/client';
import { createPropertyTypeSchema, updatePropertyTypeSchema } from '@/validations/propertyType.validation';
import { z } from 'zod';

const prisma = new PrismaClient();

export const propertyTypeService = {
  /**
   * Crear un nuevo tipo de propiedad
   */
  async createPropertyType(data: z.infer<typeof createPropertyTypeSchema>): Promise<PropertyType> {
    return prisma.propertyType.create({
      data
    });
  },

  /**
   * Obtener todos los tipos de propiedad
   */
  async getAllPropertyTypes(): Promise<PropertyType[]> {
    return prisma.propertyType.findMany({
      orderBy: {
        id: 'asc'
      }
    });
  },

  /**
   * Obtener un tipo de propiedad por ID
   */
  async getPropertyTypeById(id: number): Promise<PropertyType | null> {
    return prisma.propertyType.findUnique({
      where: { id }
    });
  },

  /**
   * Actualizar un tipo de propiedad
   */
  async updatePropertyType(
    id: number, 
    data: z.infer<typeof updatePropertyTypeSchema>
  ): Promise<PropertyType> {
    return prisma.propertyType.update({
      where: { id },
      data
    });
  },

  /**
   * Eliminar un tipo de propiedad
   */
  async deletePropertyType(id: number): Promise<PropertyType> {
    return prisma.propertyType.delete({
      where: { id }
    });
  }
}; 