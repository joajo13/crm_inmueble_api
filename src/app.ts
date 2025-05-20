import express from 'express';
import cors from 'cors';
import authRouter from '@/routes/auth.routes';
import userRouter from '@/routes/user.routes';
import propertyRouter from '@/routes/property.routes';
import errorMiddleware from '@/middlewares/error.middleware';


const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

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

// Manejo de errores
app.use(errorMiddleware);



export default app; 