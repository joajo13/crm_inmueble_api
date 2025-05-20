import { Router } from 'express';
import AuthController from '@/controllers/auth.controller';
import validateRequest from '@/middlewares/validateRequest.middleware';
import { loginSchema, refreshTokenSchema } from '@/validations/auth.validation';

const router = Router();

router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/refresh-token', validateRequest(refreshTokenSchema), AuthController.refreshToken);

export default router; 