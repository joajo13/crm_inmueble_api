import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  const errors = err.errors || undefined;

  res.status(status).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};

export default errorMiddleware; 