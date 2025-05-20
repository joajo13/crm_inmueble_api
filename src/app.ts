import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API de CRM Inmobiliario funcionando correctamente',
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString()
  });
});

// Manejador para rutas no definidas
app.use((req, res) => {
  res.status(200).json({
    message: 'Endpoint no encontrado, pero la API está funcionando correctamente',
    requestedPath: req.path,
    method: req.method,
    availableEndpoints: ['/', '/health']
  });
});

export default app; 