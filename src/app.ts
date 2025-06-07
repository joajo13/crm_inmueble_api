import express from 'express';
import cors from 'cors';
import authRouter from '@/routes/auth.routes';
import userRouter from '@/routes/user.routes';
import propertyRouter from '@/routes/property.routes';
import buildingRouter from '@/routes/building.routes';
import listingTypeRouter from '@/routes/listingType.routes';
import propertyStatusRouter from '@/routes/propertyStatus.routes';
import propertyTypeRouter from '@/routes/propertyType.routes';
import { errorMiddleware } from '@/errors';
import morgan from 'morgan';
import path from 'path'; // Necesario para construir rutas de archivos

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev')); 

// Servir archivos estáticos
app.use('/static', express.static(path.join(__dirname, '../static')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/properties', propertyRouter);
app.use('/api/buildings', buildingRouter);
app.use('/api/listing-types', listingTypeRouter);
app.use('/api/property-status', propertyStatusRouter);
app.use('/api/property-types', propertyTypeRouter);

// Manejo de errores
app.use(errorMiddleware);

export default app; 