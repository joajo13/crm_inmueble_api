import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import propertyRoutes from './property.routes';
import buildingRoutes from './building.routes';
import listingTypeRoutes from './listingType.routes';
import propertyTypeRoutes from './propertyType.routes';
import propertyStatusRoutes from './propertyStatus.routes';
import conversationRoutes from './conversation.routes';

const router = Router();

// Registrar rutas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/buildings', buildingRoutes);
router.use('/listing-types', listingTypeRoutes);
router.use('/property-types', propertyTypeRoutes);
router.use('/property-status', propertyStatusRoutes);
router.use('/conversations', conversationRoutes);

export default router; 