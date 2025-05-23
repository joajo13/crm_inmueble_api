import { PrismaClient, PropertyStatus } from '@prisma/client';
import { createPropertyStatusSchema, updatePropertyStatusSchema } from '@/validations/propertyStatus.validation';
import { z } from 'zod';

const prisma = new PrismaClient();

export const propertyStatusService = {
  /**
   * Crear un nuevo estado de propiedad
   */
  async createPropertyStatus(data: z.infer<typeof createPropertyStatusSchema>): Promise<PropertyStatus> {
    return prisma.propertyStatus.create({
      data
    });
  },

  /**
   * Obtener todos los estados de propiedad
   */
  async getAllPropertyStatuses(): Promise<PropertyStatus[]> {
    return prisma.propertyStatus.findMany({
      orderBy: {
        id: 'asc'
      }
    });
  },

  /**
   * Obtener un estado de propiedad por ID
   */
  async getPropertyStatusById(id: number): Promise<PropertyStatus | null> {
    return prisma.propertyStatus.findUnique({
      where: { id }
    });
  },

  /**
   * Actualizar un estado de propiedad
   */
  async updatePropertyStatus(
    id: number, 
    data: z.infer<typeof updatePropertyStatusSchema>
  ): Promise<PropertyStatus> {
    return prisma.propertyStatus.update({
      where: { id },
      data
    });
  },

  /**
   * Eliminar un estado de propiedad
   */
  async deletePropertyStatus(id: number): Promise<PropertyStatus> {
    return prisma.propertyStatus.delete({
      where: { id }
    });
  }
}; 