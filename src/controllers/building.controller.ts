import { Request, Response, NextFunction } from 'express';
import { BuildingService } from '@/services/building.service';
import { AppError } from '@/errors';

const buildingService = new BuildingService();

export const buildingController = {
  createBuilding: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const building = await buildingService.createBuilding(req.body);
      res.status(201).json({ success: true, data: building });
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
        throw new AppError('NOT_FOUND', [`Building with id ${id} not found`]);
      }

      res.json({ success: true, data: building });
    } catch (error) {
      next(error);
    }
  },

  updateBuilding: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const building = await buildingService.updateBuilding(id, req.body);
      res.json({ success: true, data: building });
    } catch (error) {
      next(error);
    }
  },

  deleteBuilding: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      await buildingService.deleteBuilding(id);
      res.status(200).json({ success: true, message: 'Building deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  getBuildingProperties: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const properties = await buildingService.getBuildingProperties(id);
      res.json({ success: true, data: properties });
    } catch (error) {
      next(error);
    }
  }
}; 