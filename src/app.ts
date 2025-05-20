import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import errorMiddleware from '@/middlewares/error.middleware';
// Importar las rutas 
import { propertyRoutes, userRoutes, authRoutes } from '@/routes';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);

// Middleware de manejo de errores (debe ir al final)
app.use(errorMiddleware);

export default app; 