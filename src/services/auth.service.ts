import { PrismaClient } from '@prisma/client';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '@/config';
import { LoginDTO } from '@/interfaces/auth.interface';

const prisma = new PrismaClient();

// Usar las variables de configuración centralizadas
const { secret, refreshSecret } = config.jwt;

interface JwtPayload {
  userId: number;
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
    
    if (!user) throw new Error('Usuario no encontrado');
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Credenciales inválidas');
    
    // Extraer los roles para incluirlos en el token
    const userRoles = user.roles.map(ur => ({
      id: ur.role.id,
      code: ur.role.code
    }));
    
    const accessToken = jwt.sign(
      { userId: user.id, roles: userRoles } as JwtPayload, 
      config.jwt.secret
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id } as JwtPayload, 
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
  
  generateAccessToken: (userId: number, roles: Array<{id: number, code: string}>) => {
    return jwt.sign(
      { userId, roles } as JwtPayload, 
      config.jwt.secret
    );
  },
};

export default AuthService; 