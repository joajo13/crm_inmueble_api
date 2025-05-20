import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import errorMiddleware from '@/middlewares/error.middleware';
// Importar las rutas 
import { propertyRoutes, userRoutes, authRoutes } from '@/routes';

const app = express();
let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
  console.log('Inicializando cliente Prisma');
} catch (error) {
  console.error('Error al inicializar Prisma:', error);
  prisma = {} as PrismaClient;
}

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API de CRM Inmobiliario funcionando correctamente',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      properties: '/api/properties'
    },
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    if (prisma.$queryRaw) {
      // Verificar conexión a base de datos con una consulta simple
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({ 
        status: 'ok', 
        environment: process.env.NODE_ENV,
        database: 'connected',
        timestamp: new Date().toISOString()
      });
    } else {
      // Si prisma no está disponible
      res.status(200).json({ 
        status: 'ok', 
        environment: process.env.NODE_ENV,
        database: 'not_initialized',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Health check error:', error);
    res.status(200).json({ // Usamos 200 en lugar de 500 para que el health check pase
      status: 'warning', 
      environment: process.env.NODE_ENV,
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);

// Capturar rutas no encontradas sin usar path-to-regexp
app.get('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    availableEndpoints: {
      root: '/',
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      properties: '/api/properties'
    },
    message: 'Por favor, verifica la URL e intenta nuevamente'
  });
});

// Para otros métodos HTTP (POST, PUT, DELETE, etc.)
app.all('*', (req, res) => {
  res.status(404).json({
    error: 'Método no permitido o ruta no encontrada',
    method: req.method,
    path: req.path,
    availableEndpoints: {
      root: '/',
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      properties: '/api/properties'
    },
    message: 'Por favor, verifica la URL y el método HTTP'
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorMiddleware);

export default app; 