import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ErrorCatalog } from '@/errors/error-catalog';

type RequestLocation = 'body' | 'params' | 'query';

const validateRequest = (schema: ZodSchema<any>, location: RequestLocation = 'body') => 
  (req: Request, res: Response, next: NextFunction) => {

    console.log("location", location);
    console.log("schema", schema);
    console.log("req", req);
    console.log("req.body", req.body);
    try {
      const data = location === 'body' ? req.body : location === 'params' ? req.params : req.query;
      console.log("data", data);
      schema.parse(data);
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