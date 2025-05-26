import { Request, Response, NextFunction } from 'express';
import PropertyService from '@/services/property.service';
import { AppError } from '@/errors';

const PropertyController = {
  getAllProperties: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const properties = await PropertyService.getAll();
      res.json({ success: true, data: properties });
    } catch (error) {
      next(error);
    }
  },
  
  getPropertyById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const property = await PropertyService.getById(Number(id));
      
      if (!property) {
        throw new AppError('NOT_FOUND', ['Propiedad no encontrada'],);
      }
      
      res.json({ success: true, data: property });
    } catch (error) {
      next(error);
    }
  },
  
  createProperty: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address, ...propertyData } = req.body;
      if (!address) {
        throw new AppError('VALIDATION_ERROR', ['La dirección es requerida']);
      }
      const newProperty = await PropertyService.create({ ...propertyData, address });
      res.status(201).json({ success: true, data: newProperty });
    } catch (error) {
      next(error);
    }
  },
  
  updateProperty: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const propertyData = req.body;
      
      const updatedProperty = await PropertyService.update(Number(id), propertyData);
      
      res.json({ success: true, data: updatedProperty });
    } catch (error) {
      next(error);
    }
  },
  
  deleteProperty: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await PropertyService.delete(Number(id));
      
      res.json({ success: true, message: 'Propiedad eliminada correctamente' });
    } catch (error) {
      next(error);
    }
  },
  
  getPropertiesByBuilding: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { buildingId } = req.params;
      const properties = await PropertyService.getPropertiesByBuilding(Number(buildingId));
      
      res.json({ success: true, data: properties });
    } catch (error) {
      next(error);
    }
  }
};

export default PropertyController; 