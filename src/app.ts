import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import errorMiddleware from '@/middlewares/error.middleware';
// Importar las rutas 
import { propertyRoutes, userRoutes, authRoutes } from '@/routes';

const app = express();
const prisma = new PrismaClient();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API de CRM Inmobiliario funcionando correctamente' });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a base de datos con una consulta simple
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'ok', 
      environment: process.env.NODE_ENV,
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error', 
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

// Middleware de manejo de errores (debe ir al final)
app.use(errorMiddleware);

export default app; 