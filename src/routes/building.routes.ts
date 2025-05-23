import { Router } from 'express';
import * as buildingController from '@/controllers/building.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import validateRequest from '@/middlewares/validateRequest.middleware';
import { buildingCreateSchema, buildingIdParamSchema, buildingUpdateSchema } from '@/validations';

const router = Router();

// Rutas base para edificios
router.post('/', authMiddleware, validateRequest(buildingCreateSchema), buildingController.createBuilding);
router.get('/', authMiddleware, buildingController.getAllBuildings);
router.get('/:id', authMiddleware, validateRequest(buildingIdParamSchema, 'params'), buildingController.getBuildingById);
router.put('/:id', [
  authMiddleware,
  validateRequest(buildingUpdateSchema), 
  validateRequest(buildingIdParamSchema, 'params')
], buildingController.updateBuilding);
router.delete('/:id', authMiddleware, validateRequest(buildingIdParamSchema, 'params'), buildingController.deleteBuilding);

// Rutas para relaciones
router.get('/:id/properties', authMiddleware, validateRequest(buildingIdParamSchema, 'params'), buildingController.getBuildingProperties);

export default router; 