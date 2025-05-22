import { AppError, ErrorKey } from './app-error';

/**
 * Lanza un error controlado desde el catálogo
 * @param errorKey Clave del error en el catálogo
 * @param errors Errores adicionales (opcional)
 */
export const throwError = (errorKey: ErrorKey, errors?: any[]): never => {
  throw new AppError(errorKey, errors);
};

/**
 * Crea un error controlado desde el catálogo (sin lanzarlo)
 * @param errorKey Clave del error en el catálogo
 * @param errors Errores adicionales (opcional)
 */
export const createError = (errorKey: ErrorKey, errors?: any[]): AppError => {
  return new AppError(errorKey, errors);
}; 