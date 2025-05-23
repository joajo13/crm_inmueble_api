import { Request, Response, NextFunction } from 'express';
import AuthService from '@/services/auth.service';
import { AppError } from '@/errors';

const AuthController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const tokens = await AuthService.login(email, password);
      res.json({ success: true, data: tokens });
    } catch (error) {
      next(error);
    }
  },
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError('VALIDATION_ERROR', ['Refresh token requerido']);
      }
      const payload = AuthService.verifyRefreshToken(refreshToken);
      // Obtener userId del payload y generar un nuevo token de acceso con sus roles
      const accessToken = AuthService.generateAccessToken(payload.userId, payload.roles || []);
      res.json({ success: true, data: { accessToken } });
    } catch (error) {
      next(error);
    }
  },
};

export default AuthController; 