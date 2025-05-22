export const ErrorCatalog = {
  VALIDATION_ERROR: {
    status: 400,
    message: 'Error de validación de datos',
  },
  NOT_FOUND: {
    status: 404,
    message: 'Recurso no encontrado',
  },
  UNAUTHORIZED: {
    status: 401,
    message: 'No autorizado',
  },
  FORBIDDEN: {
    status: 403,
    message: 'Prohibido',
  },
  INTERNAL_ERROR: {
    status: 500,
    message: 'Error interno del servidor',
  },
  BAD_CREDENTIALS: {
    status: 401,
    message: 'Credenciales inválidas',
  },
}; 