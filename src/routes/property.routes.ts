import { Router } from 'express';
import PropertyController from '@/controllers/property.controller';
import authMiddleware from '@/middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, PropertyController.getAllProperties);
router.get('/:id', authMiddleware, PropertyController.getPropertyById);
router.post('/', authMiddleware, PropertyController.createProperty);
router.put('/:id', authMiddleware, PropertyController.updateProperty);
router.delete('/:id', authMiddleware, PropertyController.deleteProperty);

export default router; 