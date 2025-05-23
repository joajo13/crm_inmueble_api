import { Router } from 'express';
import PropertyController from '@/controllers/property.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import validateRequest from '@/middlewares/validateRequest.middleware';
import { propertyIdParamSchema, propertyBuildingIdParamSchema, createPropertySchema, updatePropertySchema } from '@/validations/property.validation';

const router = Router();

router.get('/', authMiddleware, PropertyController.getAllProperties);
router.get('/:id', authMiddleware, validateRequest(propertyIdParamSchema, 'params'), PropertyController.getPropertyById);
router.post('/', authMiddleware, validateRequest(createPropertySchema, 'body'), PropertyController.createProperty);
router.put('/:id', authMiddleware, validateRequest(propertyIdParamSchema, 'params'), validateRequest(updatePropertySchema, 'body'), PropertyController.updateProperty);
router.delete('/:id', authMiddleware, validateRequest(propertyIdParamSchema, 'params'), PropertyController.deleteProperty);

// Ruta para obtener propiedades por edificio
router.get('/building/:buildingId', authMiddleware, validateRequest(propertyBuildingIdParamSchema, 'params'), PropertyController.getPropertiesByBuilding);

export default router; 