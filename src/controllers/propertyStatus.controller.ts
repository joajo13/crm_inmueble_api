import { Request, Response, NextFunction } from 'express';
import { propertyStatusService } from '@/services';
import { createPropertyStatusSchema, propertyStatusIdParamSchema, updatePropertyStatusSchema } from '@/validations';
import { AppError } from '@/errors/app-error';

export const propertyStatusController = {
  /**
   * Crear un nuevo estado de propiedad
   */
  async createPropertyStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createPropertyStatusSchema.parse(req.body);
      const propertyStatus = await propertyStatusService.createPropertyStatus(validatedData);
      
      res.status(201).json({
        success: true,
        data: propertyStatus
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener todos los estados de propiedad
   */
  async getAllPropertyStatuses(_req: Request, res: Response, next: NextFunction) {
    try {
      const propertyStatuses = await propertyStatusService.getAllPropertyStatuses();
      
      res.status(200).json({
        success: true,
        data: propertyStatuses
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener un estado de propiedad por ID
   */
  async getPropertyStatusById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = propertyStatusIdParamSchema.parse(req.params);
      const propertyStatus = await propertyStatusService.getPropertyStatusById(Number(id));
      
      if (!propertyStatus) {
        throw new AppError('NOT_FOUND', ['Estado de propiedad no encontrado']);
      }
      
      res.status(200).json({
        success: true,
        data: propertyStatus
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualizar un estado de propiedad
   */
  async updatePropertyStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = propertyStatusIdParamSchema.parse(req.params);
      const validatedData = updatePropertyStatusSchema.parse(req.body);
      
      const existingPropertyStatus = await propertyStatusService.getPropertyStatusById(Number(id));
      if (!existingPropertyStatus) {
        throw new AppError('NOT_FOUND', ['Estado de propiedad no encontrado']);
      }
      
      const updatedPropertyStatus = await propertyStatusService.updatePropertyStatus(Number(id), validatedData);
      
      res.status(200).json({
        success: true,
        data: updatedPropertyStatus
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Eliminar un estado de propiedad
   */
  async deletePropertyStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = propertyStatusIdParamSchema.parse(req.params);
      
      const existingPropertyStatus = await propertyStatusService.getPropertyStatusById(Number(id));
      if (!existingPropertyStatus) {
        throw new AppError('NOT_FOUND', ['Estado de propiedad no encontrado']);
      }
      
      await propertyStatusService.deletePropertyStatus(Number(id));
      
      res.status(200).json({
        success: true,
        message: 'Estado de propiedad eliminado correctamente'
      });
    } catch (error) {
      next(error);
    }
  }
}; 