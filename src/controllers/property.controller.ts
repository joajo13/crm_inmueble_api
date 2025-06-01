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
      const { address, ...data } = req.body;
      if (!address) {
        throw new AppError('VALIDATION_ERROR', ['La dirección es requerida']);
      }

      // Obtener los archivos subidos (si los hay)
      const files = req.files as Express.Multer.File[];
      let imagesData: { filePath: string; mimeType: string }[] = [];

      if (files && files.length > 0) {
        imagesData = files.map(file => ({
          filePath: `images/properties/${file.filename}`,
          mimeType: file.mimetype
        }));
      }

      const propertyData = {
        ...data,
        address: address,
        images: imagesData,
        agentId: data.agentId ? parseInt(data.agentId) : null,
        buildingId: data.buildingId ? parseInt(data.buildingId) : null,
        listingTypeId: parseInt(data.listingTypeId),
        statusId: parseInt(data.statusId),
        propertyTypeId: parseInt(data.propertyTypeId),
        addressId: parseInt(data.addressId),
        totalAreaM2: parseFloat(data.totalAreaM2),
        coveredAreaM2: parseFloat(data.coveredAreaM2),
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
      }

      const newProperty = await PropertyService.create(propertyData);
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
  },

  uploadPropertyImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!req.file) {
        throw new AppError('VALIDATION_ERROR', ['No se ha subido ningún archivo.']);
      }

      // Construir la ruta relativa para guardar en la BD
      // req.file.path te da la ruta absoluta, necesitamos la relativa a /static/
      const relativeFilePath = `images/properties/${req.file.filename}`;

      const imageData = {
        filePath: relativeFilePath,
        mimeType: req.file.mimetype
      };

      const image = await PropertyService.addImageToProperty(Number(id), imageData);
      res.status(201).json({ success: true, data: image });
    } catch (error) {
      next(error);
    }
  }
};

export default PropertyController; 