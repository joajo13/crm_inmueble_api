import { PrismaClient, User } from '@prisma/client';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '@/config';
import { LoginDTO } from '@/interfaces/auth.interface';
import { AppError } from '@/errors';

const prisma = new PrismaClient();

// Usar las variables de configuración centralizadas
const { secret, refreshSecret } = config.jwt;

interface JwtPayload {
  user: User;
  roles?: Array<{id: number, code: string}>;
}

const AuthService = {
  login: async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { 
        roles: {
          include: {
            role: true
          }
        } 
      }
    });
    
    if (!user) throw new AppError('BAD_CREDENTIALS', ['Credenciales incorrectas']);
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError('BAD_CREDENTIALS', ['Credenciales incorrectas']);
    
    // Extraer los roles para incluirlos en el token
    const userRoles = user.roles.map(ur => ({
      id: ur.role.id,
      code: ur.role.code
    }));
    
    const accessToken = jwt.sign(
      { user, roles: userRoles } as JwtPayload, 
      config.jwt.secret
    );
    
    const refreshToken = jwt.sign(
      { user } as JwtPayload, 
      config.jwt.refreshSecret
    );
    
    return { accessToken, refreshToken };
  },
  
  verifyAccessToken: (token: string): JwtPayload => {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  },
  
  verifyRefreshToken: (token: string): JwtPayload => {
    return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
  },
  
  generateNewTokens: (user: User, roles: Array<{id: number, code: string}>) => {
    const accessToken = jwt.sign(
      { user, roles } as JwtPayload, 
      config.jwt.secret
    );
    
    const refreshToken = jwt.sign(
      { user } as JwtPayload, 
      config.jwt.refreshSecret
    );
    
    return { accessToken, refreshToken };
  },
};

export default AuthService; 