import { Request, Response } from 'express';
import { BuildingService } from '@/services/building.service';
import { AppError } from '@/errors';

const buildingService = new BuildingService();

export const createBuilding = async (req: Request, res: Response) => {
  const building = await buildingService.createBuilding(req.body);
  res.status(201).json(building);
};

export const getAllBuildings = async (req: Request, res: Response) => {
  const buildings = await buildingService.getAllBuildings();
  res.json(buildings);
};

export const getBuildingById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const building = await buildingService.getBuildingById(id);

  if (!building) {
    throw new AppError('NOT_FOUND', [{ entity: 'Building', id }]);
  }

  res.json(building);
};

export const updateBuilding = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const building = await buildingService.updateBuilding(id, req.body);
  res.json(building);
};

export const deleteBuilding = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  await buildingService.deleteBuilding(id);
  res.status(204).send();
};

export const getBuildingProperties = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const properties = await buildingService.getBuildingProperties(id);
  res.json(properties);
}; 