import { Request, Response, NextFunction } from "express";
import PropertyService from "@/services/property.service";
import { AppError } from "@/errors";
import fs from "fs";
import path from "path";
import ImageService from "@/services/image.service";

const PropertyController = {
  createProperty: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const files = req.files as Express.Multer.File[];
      let imagesData: { filePath: string; mimeType: string }[] = [];

      console.log("files", files);

      if (files && files.length > 0) {
        imagesData = files.map((file) => ({
          filePath: `tmp/${file.filename}`,
          mimeType: file.mimetype,
        }));
      }

      const propertyData = {
        ...data,
        agentId: data.agentId ? parseInt(data.agentId) : null,
        buildingId: data.buildingId ? parseInt(data.buildingId) : null,
        listingTypeId: parseInt(data.listingTypeId),
        statusId: parseInt(data.statusId),
        propertyTypeId: parseInt(data.propertyTypeId),
        totalAreaM2: parseFloat(data.totalAreaM2),
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
      };

      const newProperty = await PropertyService.create(propertyData);

      const propertyId = newProperty!.id;

      // Procesar cada imagen
      for (const image of imagesData) {
        // Guardar la imagen en la base de datos y obtener su ID
        const savedImage = await ImageService.savePropertyImage(propertyId, {
          filePath: image.filePath,
          mimeType: image.mimeType,
        });

        // Mover el archivo a su ubicación final
        ImageService.moveImageToProperty(image.filePath, savedImage.filePath);
      }

      res.status(201).json({ success: true, data: newProperty });
    } catch (error) {
      next(error);
    }
  },

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
        throw new AppError("NOT_FOUND", ["Propiedad no encontrada"]);
      }

      res.json({ success: true, data: property });
    } catch (error) {
      next(error);
    }
  },

  updateProperty: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const propertyData = req.body;
      console.log("propertyData", propertyData);
      const newPropertyData = {
        ...propertyData,
        agentId: propertyData.agentId ? parseInt(propertyData.agentId) : null,
        buildingId: propertyData.buildingId
          ? parseInt(propertyData.buildingId)
          : null,
        listingTypeId: parseInt(propertyData.listingTypeId),
        statusId: parseInt(propertyData.statusId),
        propertyTypeId: parseInt(propertyData.propertyTypeId),
        totalAreaM2: parseFloat(propertyData.totalAreaM2),
        bedrooms: parseInt(propertyData.bedrooms),
        bathrooms: parseInt(propertyData.bathrooms),
        lat: propertyData.lat ? parseFloat(propertyData.lat) : null,
        lng: propertyData.lng ? parseFloat(propertyData.lng) : null,
      };

      const updatedProperty = await PropertyService.update(
        Number(id),
        newPropertyData
      );

      res.json({ success: true, data: updatedProperty });
    } catch (error) {
      next(error);
    }
  },

  deleteProperty: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await PropertyService.delete(Number(id));

      res.json({ success: true, message: "Propiedad eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  },

  getPropertiesByBuilding: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { buildingId } = req.params;
      const properties = await PropertyService.getPropertiesByBuilding(
        Number(buildingId)
      );

      res.json({ success: true, data: properties });
    } catch (error) {
      next(error);
    }
  },

  uploadPropertyImage: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      if (!req.file) {
        throw new AppError("VALIDATION_ERROR", [
          "No se ha subido ningún archivo.",
        ]);
      }

      const property = await PropertyService.getById(Number(id));
      if (!property) {
        throw new AppError("NOT_FOUND", ["Propiedad no encontrada"]);
      }

      // Guardar la imagen en la base de datos y obtener su ID
      const savedImage = await ImageService.savePropertyImage(property.id, {
        filePath: req.file.path,
        mimeType: req.file.mimetype,
      });

      // Mover el archivo a su ubicación final
      ImageService.moveImageToProperty(req.file.path, savedImage.filePath);

      res.status(201).json({ success: true, data: savedImage });
    } catch (error) {
      next(error);
    }
  },

  deletePropertyImage: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { imageId } = req.params;

      const image = await ImageService.getById(Number(imageId));

      if (!image) {
        throw new AppError("NOT_FOUND", ["Imagen no encontrada"]);
      }

      fs.unlinkSync(image.filePath);

      await ImageService.deleteImage(Number(imageId));

      res.json({ success: true, message: "Imagen eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  },

  getImagesByPropertyId: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const images = await ImageService.getImagesByPropertyId(Number(id));
      res.json({ success: true, data: images });
    } catch (error) {
      next(error);
    }
  },
};

export default PropertyController;
