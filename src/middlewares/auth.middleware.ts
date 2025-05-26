import { Request, Response, NextFunction } from 'express';
import AuthService from '@/services/auth.service';

// Extender la interfaz Request para incluir el usuario con sus roles
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        roles?: Array<{id: number, code: string}>;
      };
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ success: false, message: 'No autorizado' });
    return;
  }
  
  try {
    const payload = AuthService.verifyAccessToken(token);
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido' });
    return;
  }
};

export default authMiddleware; 