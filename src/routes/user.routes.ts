import { Router } from 'express';
import UserController from '@/controllers/user.controller';
import validateRequest from '@/middlewares/validateRequest.middleware';
import { userSchema, updateUserRolesSchema } from '@/validations/user.validation';
import authMiddleware from '@/middlewares/auth.middleware';

const router = Router();

// Todas las rutas protegidas por autenticación
router.post('/', authMiddleware, validateRequest(userSchema), UserController.createUser);
router.get('/', authMiddleware, UserController.getAllUsers);
router.get('/:id', authMiddleware, UserController.getUserById);
router.put('/:id', authMiddleware, validateRequest(userSchema), UserController.updateUser);
router.delete('/:id', authMiddleware, UserController.deleteUser);

// Ruta para manejar roles de usuario
router.put('/:id/roles', authMiddleware, validateRequest(updateUserRolesSchema), UserController.updateUserRoles);

export default router; 