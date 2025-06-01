import { PrismaClient, Address, Prisma } from '@prisma/client';
import { createAddressSchema, updateAddressSchema } from '@/validations/address.validation';
import { z } from 'zod';

const globalPrisma = new PrismaClient();

export const addressService = {
  /**
   * Crear una nueva dirección
   */
  async createAddress(
    data: z.infer<typeof createAddressSchema>,
    prismaClient?: Prisma.TransactionClient
  ): Promise<Address> {
    const prisma = prismaClient || globalPrisma;
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
      globalPrisma.address.findMany({
        skip,
        take: limit,
        orderBy: {
          id: 'asc'
        }
      }),
      globalPrisma.address.count()
    ]);
    
    return { addresses, total };
  },

  /**
   * Obtener una dirección por ID
   */
  async getAddressById(id: number): Promise<Address | null> {
    return globalPrisma.address.findUnique({
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
    return globalPrisma.address.update({
      where: { id },
      data
    });
  },

  /**
   * Eliminar una dirección
   */
  async deleteAddress(id: number): Promise<Address> {
    return globalPrisma.address.delete({
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
    
    return globalPrisma.address.findMany({
      where: whereClause,
      orderBy: {
        id: 'asc'
      },
      take: 50
    });
  },

  /**
   * Buscar una dirección por todos los campos relevantes
   */
  async findAddressByFields(fields: {
    street: string;
    number?: string | null;
    city: string;
    province: string;
    postalCode?: string | null;
    extraInfo?: string | null;
  },
  prismaClient?: Prisma.TransactionClient
  ): Promise<Address | null> {
    const prisma = prismaClient || globalPrisma;
    return prisma.address.findFirst({
      where: {
        street: fields.street,
        number: fields.number ?? undefined,
        city: fields.city,
        province: fields.province,
        postalCode: fields.postalCode ?? undefined,
        extraInfo: fields.extraInfo ?? undefined,
      }
    });
  }
}; 