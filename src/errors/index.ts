export * from './app-error';
export * from './error-catalog';
export * from './error-handler';

// Re-exportar también el middleware de errores para facilidad de uso
export { default as errorMiddleware } from '@/middlewares/error.middleware'; 