# CRM Inmobiliario API

API RESTful para gestión de propiedades inmobiliarias, edificios y usuarios.

## Estructura del proyecto

El proyecto sigue una arquitectura de capas con la siguiente estructura:

```
src/
├── controllers/    # Controladores que manejan las solicitudes HTTP
├── services/       # Lógica de negocio
├── routes/         # Definición de rutas de la API
├── middlewares/    # Middlewares para autenticación, validación, etc.
├── validations/    # Esquemas de validación
├── errors/         # Manejo centralizado de errores
└── utils/          # Utilidades y funciones auxiliares
```

## Modelo de datos

El CRM Inmobiliario gestiona principalmente tres entidades:

### Propiedades
Representan los inmuebles disponibles para venta o renta. Cada propiedad puede estar asociada opcionalmente a un edificio.

### Edificios
Representan complejos residenciales o comerciales que contienen múltiples propiedades.

### Usuarios
Representan a los usuarios del sistema (administradores, vendedores, etc.) que gestionan propiedades.

## Cambios en la estructura de datos

### Actualización reciente: Relación directa Propiedad-Edificio

Se ha modificado la estructura de datos para simplificar el modelo:

- Se eliminó la entidad **Unidad** que anteriormente servía como intermediaria entre Propiedades y Edificios.
- Ahora las propiedades se relacionan directamente con los edificios a través del campo `buildingId`.
- Esta simplificación facilita la gestión de propiedades dentro de edificios.

## Endpoints disponibles

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh-token` - Refrescar token de acceso

### Propiedades
- `GET /api/properties` - Obtener todas las propiedades
- `GET /api/properties/:id` - Obtener propiedad por ID
- `POST /api/properties` - Crear nueva propiedad
- `PUT /api/properties/:id` - Actualizar propiedad existente
- `DELETE /api/properties/:id` - Eliminar propiedad
- `GET /api/properties/building/:buildingId` - Obtener propiedades por edificio

### Edificios
- `GET /api/buildings` - Obtener todos los edificios
- `GET /api/buildings/:id` - Obtener edificio por ID
- `POST /api/buildings` - Crear nuevo edificio
- `PUT /api/buildings/:id` - Actualizar edificio existente
- `DELETE /api/buildings/:id` - Eliminar edificio
- `GET /api/buildings/:id/properties` - Obtener propiedades de un edificio

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar usuario existente
- `DELETE /api/users/:id` - Eliminar usuario
- `PUT /api/users/:id/roles` - Actualizar roles de usuario

## Ejemplo de uso

### Crear un edificio

```json
POST /api/buildings
{
  "name": "Torre Reforma",
  "addressId": 1,
  "yearBuilt": 2015,
  "floors": 57,
  "totalUnits": 120,
  "lat": 19.424438,
  "lng": -99.175772
}
```

### Crear una propiedad asociada a un edificio

```json
POST /api/properties
{
  "titulo": "Apartamento de lujo en Polanco",
  "descripcion": "Hermoso apartamento con 3 habitaciones, 2 baños, cocina integral y vista panorámica",
  "direccion": "Av. Presidente Masaryk 123, Polanco, CDMX",
  "precio": 4500000,
  "tipo": "apartamento",
  "habitaciones": 3,
  "banos": 2,
  "area": 120,
  "buildingId": 1
}
```

### Obtener propiedades de un edificio

```
GET /api/buildings/1/properties
``` 