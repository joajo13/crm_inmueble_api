import { Router } from 'express';
import { propertyTypeController } from '@/controllers/propertyType.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import validateRequest from '@/middlewares/validateRequest.middleware';
import { propertyTypeIdParamSchema, createPropertyTypeSchema, updatePropertyTypeSchema } from '@/validations';

const router = Router();

// Rutas públicas
router.get('/', propertyTypeController.getAllPropertyTypes);
router.get('/:id', [
  authMiddleware,
  validateRequest(propertyTypeIdParamSchema, 'params')
], propertyTypeController.getPropertyTypeById);

// Rutas protegidas que requieren autenticación
router.post('/', [
  authMiddleware,
  validateRequest(createPropertyTypeSchema)
], propertyTypeController.createPropertyType);

router.put('/:id', [
  authMiddleware,
  validateRequest(propertyTypeIdParamSchema, 'params'),
  validateRequest(updatePropertyTypeSchema)
], propertyTypeController.updatePropertyType);

router.delete('/:id', [
  authMiddleware,
  validateRequest(propertyTypeIdParamSchema, 'params')
], propertyTypeController.deletePropertyType);

export default router; 