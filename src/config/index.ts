import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), `.env`);
dotenv.config({ path: envPath });

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Variables de configuración para JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'secret_key_change_in_production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_key_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  
  // Variables de base de datos
  database: {
    url: process.env.DATABASE_URL
  }
}; 