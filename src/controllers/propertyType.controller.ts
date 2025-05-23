import { Request, Response, NextFunction } from 'express';
import { propertyTypeService } from '@/services';
import { createPropertyTypeSchema, propertyTypeIdParamSchema, updatePropertyTypeSchema } from '@/validations';
import { AppError } from '@/errors/app-error';

export const propertyTypeController = {
  /**
   * Crear un nuevo tipo de propiedad
   */
  async createPropertyType(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createPropertyTypeSchema.parse(req.body);
      const propertyType = await propertyTypeService.createPropertyType(validatedData);
      
      res.status(201).json({
        success: true,
        data: propertyType
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener todos los tipos de propiedad
   */
  async getAllPropertyTypes(_req: Request, res: Response, next: NextFunction) {
    try {
      const propertyTypes = await propertyTypeService.getAllPropertyTypes();
      
      res.status(200).json({
        success: true,
        data: propertyTypes
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obtener un tipo de propiedad por ID
   */
  async getPropertyTypeById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = propertyTypeIdParamSchema.parse(req.params);
      const propertyType = await propertyTypeService.getPropertyTypeById(Number(id));
      
      if (!propertyType) {
        throw new AppError('NOT_FOUND', ['Tipo de propiedad no encontrado']);
      }
      
      res.status(200).json({
        success: true,
        data: propertyType
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Actualizar un tipo de propiedad
   */
  async updatePropertyType(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = propertyTypeIdParamSchema.parse(req.params);
      const validatedData = updatePropertyTypeSchema.parse(req.body);
      
      const existingPropertyType = await propertyTypeService.getPropertyTypeById(Number(id));
      if (!existingPropertyType) {
        throw new AppError('NOT_FOUND', ['Tipo de propiedad no encontrado']);
      }
      
      const updatedPropertyType = await propertyTypeService.updatePropertyType(Number(id), validatedData);
      
      res.status(200).json({
        success: true,
        data: updatedPropertyType
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Eliminar un tipo de propiedad
   */
  async deletePropertyType(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = propertyTypeIdParamSchema.parse(req.params);
      
      const existingPropertyType = await propertyTypeService.getPropertyTypeById(Number(id));
      if (!existingPropertyType) {
        throw new AppError('NOT_FOUND', ['Tipo de propiedad no encontrado']);
      }
      
      await propertyTypeService.deletePropertyType(Number(id));
      
      res.status(200).json({
        success: true,
        message: 'Tipo de propiedad eliminado correctamente'
      });
    } catch (error) {
      next(error);
    }
  }
}; 