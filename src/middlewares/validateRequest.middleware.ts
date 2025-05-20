import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ErrorCatalog } from '@/errors/error-catalog';

const validateRequest = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(ErrorCatalog.VALIDATION_ERROR.status).json({
      success: false,
      message: ErrorCatalog.VALIDATION_ERROR.message,
      errors: error.errors || [],
    });
  }
};

export default validateRequest; 