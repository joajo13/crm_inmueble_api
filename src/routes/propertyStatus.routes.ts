import { Router } from 'express';
import { propertyStatusController } from '@/controllers/propertyStatus.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import validateRequest from '@/middlewares/validateRequest.middleware';
import { propertyStatusIdParamSchema, createPropertyStatusSchema, updatePropertyStatusSchema } from '@/validations';

const router = Router();

// Rutas públicas
router.get('/', propertyStatusController.getAllPropertyStatuses);
router.get('/:id', [
  authMiddleware,
  validateRequest(propertyStatusIdParamSchema, 'params')
], propertyStatusController.getPropertyStatusById);

// Rutas protegidas que requieren autenticación
router.post('/', [
  authMiddleware,
  validateRequest(createPropertyStatusSchema)
], propertyStatusController.createPropertyStatus);

router.put('/:id', [
  authMiddleware,
  validateRequest(propertyStatusIdParamSchema, 'params'),
  validateRequest(updatePropertyStatusSchema)
], propertyStatusController.updatePropertyStatus);

router.delete('/:id', [
  authMiddleware,
  validateRequest(propertyStatusIdParamSchema, 'params')
], propertyStatusController.deletePropertyStatus);

export default router; 