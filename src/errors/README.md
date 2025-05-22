# Sistema de Manejo de Errores

Este sistema permite manejar errores de forma controlada en la aplicación, usando un catálogo centralizado de errores.

## Características

- Errores tipados y centralizados en un catálogo
- Distinción entre errores operacionales (controlados) y de programación (no controlados)
- Ocultamiento de información sensible para errores no controlados
- Facilidad para lanzar errores desde cualquier parte de la aplicación

## Uso básico

```typescript
import { throwError } from '../errors';

// En una ruta o controlador
router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    
    if (!user) {
      // Lanzar un error del catálogo
      throwError('NOT_FOUND', ['Usuario no encontrado']);
    }
    
    res.json(user);
  } catch (err) {
    next(err); // Pasar el error al middleware
  }
});
```

## Validación con errores múltiples

```typescript
import { throwError } from '../errors';

function validateUser(user) {
  const errors = [];
  
  if (!user.name) {
    errors.push('El nombre es obligatorio');
  }
  
  if (!user.email) {
    errors.push('El email es obligatorio');
  }
  
  if (errors.length > 0) {
    throwError('VALIDATION_ERROR', errors);
  }
}
```

## Configuración en la aplicación

```typescript
import express from 'express';
import { errorMiddleware } from './errors';

const app = express();

// ... otras configuraciones y rutas

// Middleware de errores (debe ser el último middleware)
app.use(errorMiddleware);
``` 