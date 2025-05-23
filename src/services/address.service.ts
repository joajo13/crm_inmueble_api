import { PrismaClient, Address } from '@prisma/client';
import { createAddressSchema, updateAddressSchema } from '@/validations/address.validation';
import { z } from 'zod';

const prisma = new PrismaClient();

export const addressService = {
  /**
   * Crear una nueva dirección
   */
  async createAddress(data: z.infer<typeof createAddressSchema>): Promise<Address> {
    return prisma.address.create({
      data
    });
  },

  /**
   * Obtener todas las direcciones
   */
  async getAllAddresses(page = 1, limit = 10): Promise<{addresses: Address[], total: number}> {
    const skip = (page - 1) * limit;
    
    const [addresses, total] = await Promise.all([
      prisma.address.findMany({
        skip,
        take: limit,
        orderBy: {
          id: 'asc'
        }
      }),
      prisma.address.count()
    ]);
    
    return { addresses, total };
  },

  /**
   * Obtener una dirección por ID
   */
  async getAddressById(id: number): Promise<Address | null> {
    return prisma.address.findUnique({
      where: { id }
    });
  },

  /**
   * Actualizar una dirección
   */
  async updateAddress(
    id: number, 
    data: z.infer<typeof updateAddressSchema>
  ): Promise<Address> {
    return prisma.address.update({
      where: { id },
      data
    });
  },

  /**
   * Eliminar una dirección
   */
  async deleteAddress(id: number): Promise<Address> {
    return prisma.address.delete({
      where: { id }
    });
  },
  
  /**
   * Buscar direcciones por ciudad y/o provincia
   */
  async searchAddresses(city?: string, province?: string): Promise<Address[]> {
    const whereClause: any = {};
    
    if (city) {
      whereClause.city = {
        contains: city,
        mode: 'insensitive'
      };
    }
    
    if (province) {
      whereClause.province = {
        contains: province,
        mode: 'insensitive'
      };
    }
    
    return prisma.address.findMany({
      where: whereClause,
      orderBy: {
        id: 'asc'
      },
      take: 50
    });
  }
}; 