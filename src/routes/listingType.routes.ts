import { Router } from 'express';
import { listingTypeController } from '@/controllers/listingType.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import validateRequest from '@/middlewares/validateRequest.middleware';
import { listingTypeIdParamSchema, createListingTypeSchema, updateListingTypeSchema } from '@/validations';

const router = Router();

// Rutas públicas
router.get('/', authMiddleware, listingTypeController.getAllListingTypes);
router.get('/:id', [
  authMiddleware,
  validateRequest(listingTypeIdParamSchema, 'params')
], listingTypeController.getListingTypeById);

// Rutas protegidas que requieren autenticación
router.post('/', [
  authMiddleware,
  validateRequest(createListingTypeSchema)
], listingTypeController.createListingType);

router.put('/:id', [
  authMiddleware,
  validateRequest(listingTypeIdParamSchema, 'params'),
  validateRequest(updateListingTypeSchema)
], listingTypeController.updateListingType);

router.delete('/:id', [
  authMiddleware,
  validateRequest(listingTypeIdParamSchema, 'params')
], listingTypeController.deleteListingType);

export default router; 