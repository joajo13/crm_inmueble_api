import { Request, Response, NextFunction } from 'express';
import { listingTypeService } from '@/services';
import { createListingTypeSchema, listingTypeIdParamSchema, updateListingTypeSchema } from '@/validations';
import { AppError } from '@/errors/app-error';

export const listingTypeController = {
  /**
   * Crear un nuevo tipo de listado
   */
  async createListingType(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createListingTypeSchema.parse(req.body);
      const listingType = await listingTypeService.createListingType(validatedData);
      
      res.status(201).json({
        success: true,
        data: listingType
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener todos los tipos de listado
   */
  async getAllListingTypes(_req: Request, res: Response, next: NextFunction) {
    try {
      const listingTypes = await listingTypeService.getAllListingTypes();
      
      res.status(200).json({
        success: true,
        data: listingTypes
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener un tipo de listado por ID
   */
  async getListingTypeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = listingTypeIdParamSchema.parse(req.params);
      const listingType = await listingTypeService.getListingTypeById(Number(id));
      
      if (!listingType) {
        throw new AppError('NOT_FOUND', ['Tipo de listado no encontrado']);
      }
      
      res.status(200).json({
        success: true,
        data: listingType
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualizar un tipo de listado
   */
  async updateListingType(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = listingTypeIdParamSchema.parse(req.params);
      
      const existingListingType = await listingTypeService.getListingTypeById(Number(id));
      if (!existingListingType) {
        throw new AppError('NOT_FOUND', ['Tipo de listado no encontrado']);
      }
      
      const updatedListingType = await listingTypeService.updateListingType(Number(id), req.body);
      
      res.status(200).json({
        success: true,
        data: updatedListingType
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Eliminar un tipo de listado
   */
  async deleteListingType(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = listingTypeIdParamSchema.parse(req.params);
      
      const existingListingType = await listingTypeService.getListingTypeById(Number(id));
      if (!existingListingType) {
        throw new AppError('NOT_FOUND', ['Tipo de listado no encontrado']);
      }
      
      await listingTypeService.deleteListingType(Number(id));
      
      res.status(200).json({
        success: true,
        message: 'Tipo de listado eliminado correctamente'
      });
    } catch (error) {
      next(error);
    }
  }
}; 