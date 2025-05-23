import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/errors/app-error';
import { ErrorCatalog } from '@/errors/error-catalog';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  // Si es un error de la aplicación (controlado)
  if (err instanceof AppError) {
    res.status(err.status).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors })
    });

    return;
  }
  
  // Para errores no controlados o del sistema
  // Enviamos información mínima para evitar exponer datos sensibles
  res.status(500).json({
    success: false,
    message: ErrorCatalog.INTERNAL_ERROR.message
  });

  return
};

export default errorMiddleware; 