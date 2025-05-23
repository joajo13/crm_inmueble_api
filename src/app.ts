import express from 'express';
import cors from 'cors';
import authRouter from '@/routes/auth.routes';
import userRouter from '@/routes/user.routes';
import propertyRouter from '@/routes/property.routes';
import buildingRouter from '@/routes/building.routes';
import listingTypeRouter from '@/routes/listingType.routes';
import propertyStatusRouter from '@/routes/propertyStatus.routes';
import propertyTypeRouter from '@/routes/propertyType.routes';
import addressRouter from '@/routes/address.routes';
import { errorMiddleware } from '@/errors';
import morgan from 'morgan';

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); 

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
app.use('/api/addresses', addressRouter);

// Manejo de errores
app.use(errorMiddleware);



export default app; 