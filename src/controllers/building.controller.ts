import { Request, Response, NextFunction } from "express";
import { BuildingService } from "@/services/building.service";
import { AppError } from "@/errors";
import ImageService from "@/services/image.service";
import fs from "fs";

const buildingService = new BuildingService();

export const buildingController = {
  createBuilding: async (req: Request, res: Response, next: NextFunction) => {
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

      const buildingData = {
        ...data,
        yearBuilt: parseInt(data.yearBuilt),
        floors: parseInt(data.floors),
        totalUnits: parseInt(data.totalUnits),
        lat: data.lat ? parseFloat(data.lat) : null,
        lng: data.lng ? parseFloat(data.lng) : null,
      };

      const newBuilding = await buildingService.createBuilding(buildingData);

      for (const image of imagesData) {
        const savedImage = await ImageService.saveBuildingImage(
          newBuilding.id,
          {
            filePath: image.filePath,
            mimeType: image.mimeType,
          }
        );

        ImageService.moveImageToBuilding(image.filePath, savedImage.filePath);
      }

      res.status(201).json({ success: true, data: newBuilding });
    } catch (error) {
      next(error);
    }
  },

  getAllBuildings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buildings = await buildingService.getAllBuildings();
      res.json({ success: true, data: buildings });
    } catch (error) {
      next(error);
    }
  },

  getBuildingById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const building = await buildingService.getBuildingById(id);

      if (!building) {
        throw new AppError("NOT_FOUND", [`Building with id ${id} not found`]);
      }

      res.json({ success: true, data: building });
    } catch (error) {
      next(error);
    }
  },

  updateBuilding: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const buildingData = req.body;

      const newBuildingData = {
        ...buildingData,
      };

      const updatedBuilding = await buildingService.updateBuilding(
        Number(id),
        newBuildingData
      );
      res.json({ success: true, data: updatedBuilding });
    } catch (error) {
      next(error);
    }
  },

  deleteBuilding: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      await buildingService.deleteBuilding(id);
      res
        .status(200)
        .json({ success: true, message: "Building deleted successfully" });
    } catch (error) {
      next(error);
    }
  },

  getBuildingProperties: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = parseInt(req.params.id);
      const properties = await buildingService.getBuildingProperties(id);
      res.json({ success: true, data: properties });
    } catch (error) {
      next(error);
    }
  },

  getBuildingImages: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = parseInt(req.params.id);
      const images = await ImageService.getImagesByBuildingId(id);
      res.json({ success: true, data: images });
    } catch (error) {
      next(error);
    }
  },

  uploadBuildingImage: async (
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

      const building = await buildingService.getBuildingById(Number(id));
      if (!building) {
        throw new AppError("NOT_FOUND", ["Building not found"]);
      }

      // Guardar la imagen en la base de datos y obtener su ID
      const savedImage = await ImageService.saveBuildingImage(
        Number(id),
        {
          filePath: req.file.path,
          mimeType: req.file.mimetype
        }
      );

      // Mover el archivo a su ubicación final
      ImageService.moveImageToBuilding(req.file.path, savedImage.filePath);

      res.json({ success: true, data: savedImage });
    } catch (error) {
      next(error);
    }
  },

  deleteBuildingImage: async (
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

      await ImageService.deleteBuildingImage(Number(imageId));
      res.json({ success: true, message: "Image deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default buildingController;
