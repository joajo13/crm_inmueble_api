import { ErrorCatalog } from './error-catalog';

export type ErrorKey = keyof typeof ErrorCatalog;

export class AppError extends Error {
  status: number;
  errors?: any[];
  isOperational: boolean;

  constructor(errorKey: ErrorKey, errors?: any[], isOperational: boolean = true) {
    const errorInfo = ErrorCatalog[errorKey];
    super(errorInfo.message);
    
    this.name = this.constructor.name;
    this.status = errorInfo.status;
    this.errors = errors;
    this.isOperational = isOperational; // Si es un error operacional (controlado) o no

    // Capturar la pila de llamadas para rastreo de errores
    Error.captureStackTrace(this, this.constructor);
  }
} 