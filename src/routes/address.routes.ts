import { Router } from 'express';
import { addressController } from '@/controllers/address.controller';
import authMiddleware from '@/middlewares/auth.middleware';
import validateRequest from '@/middlewares/validateRequest.middleware';
import { addressIdParamSchema, createAddressSchema, updateAddressSchema } from '@/validations';

const router = Router();

// Rutas públicas
router.get('/', authMiddleware, addressController.getAllAddresses);
router.get('/search', authMiddleware, addressController.searchAddresses);
router.get('/:id', [
  authMiddleware,
  validateRequest(addressIdParamSchema, 'params')
], addressController.getAddressById);

// Rutas protegidas que requieren autenticación
router.post('/', [
  authMiddleware,
  validateRequest(createAddressSchema)
], addressController.createAddress);

router.put('/:id', [
  authMiddleware,
  validateRequest(addressIdParamSchema, 'params'),
  validateRequest(updateAddressSchema)
], addressController.updateAddress);

router.delete('/:id', [
  authMiddleware,
  validateRequest(addressIdParamSchema, 'params')
], addressController.deleteAddress);

export default router; 