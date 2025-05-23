import { Request, Response, NextFunction } from 'express';
import { addressService } from '@/services';
import { createAddressSchema, addressIdParamSchema, updateAddressSchema } from '@/validations';
import { AppError } from '@/errors/app-error';
import { ErrorCatalog } from '@/errors/error-catalog';

export const addressController = {
  /**
   * Crear una nueva dirección
   */
  async createAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createAddressSchema.parse(req.body);
      const address = await addressService.createAddress(validatedData);
      
      res.status(201).json({
        success: true,
        data: address
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener todas las direcciones con paginación
   */
  async getAllAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      
      const result = await addressService.getAllAddresses(page, limit);
      
      res.status(200).json({
        success: true,
        data: result.addresses,
        pagination: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Buscar direcciones por ciudad y/o provincia
   */
  async searchAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const { city, province } = req.query;
      
      if (!city && !province) {
        throw new AppError('VALIDATION_ERROR', ['Debe proporcionar al menos un criterio de búsqueda (ciudad o provincia)']);
      }
      
      const addresses = await addressService.searchAddresses(
        city as string | undefined, 
        province as string | undefined
      );
      
      res.status(200).json({
        success: true,
        data: addresses
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener una dirección por ID
   */
  async getAddressById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = addressIdParamSchema.parse(req.params);
      const address = await addressService.getAddressById(Number(id));
      
      if (!address) {
        throw new AppError('NOT_FOUND', ['Dirección no encontrada']);
      }
      
      res.status(200).json({
        success: true,
        data: address
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualizar una dirección
   */
  async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = addressIdParamSchema.parse(req.params);
      const validatedData = updateAddressSchema.parse(req.body);
      
      const existingAddress = await addressService.getAddressById(Number(id));
      if (!existingAddress) {
        throw new AppError('NOT_FOUND', ['Dirección no encontrada']);
      }
      
      const updatedAddress = await addressService.updateAddress(Number(id), validatedData);
      
      res.status(200).json({
        success: true,
        data: updatedAddress
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Eliminar una dirección
   */
  async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = addressIdParamSchema.parse(req.params);
      
      const existingAddress = await addressService.getAddressById(Number(id));
      if (!existingAddress) {
        throw new AppError('NOT_FOUND', ['Dirección no encontrada']);
      }
      
      await addressService.deleteAddress(Number(id));
      
      res.status(200).json({
        success: true,
        message: 'Dirección eliminada correctamente'
      });
    } catch (error) {
      next(error);
    }
  }
}; 