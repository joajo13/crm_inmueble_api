# Documentación de Postman para API CRM Inmobiliario

## Introducción

Esta colección de Postman contiene todas las solicitudes necesarias para interactuar con la API del CRM Inmobiliario. La colección está organizada en carpetas según los diferentes recursos disponibles: Autenticación, Propiedades y Usuarios.

## Requisitos previos

- [Postman](https://www.postman.com/downloads/) instalado en tu equipo
- Servidor API CRM Inmobiliario en ejecución

## Importar la colección

1. Abre Postman
2. Haz clic en el botón "Import" (Importar) en la esquina superior izquierda
3. Selecciona el archivo `crm_inmuebles_postman_collection.json`
4. Haz clic en "Import" para finalizar

## Configuración de variables

La colección utiliza variables de entorno para facilitar su uso en diferentes ambientes. Configura las siguientes variables:

1. Haz clic en el ícono de engranaje (⚙️) en la esquina superior derecha
2. Selecciona "Manage Environments" (Administrar entornos)
3. Haz clic en "Add" (Agregar) para crear un nuevo entorno
4. Establece las siguientes variables:
   - `baseUrl`: URL base de la API (por defecto: http://localhost:3000)
   - `accessToken`: Se completará automáticamente después de iniciar sesión

## Uso de la colección

### Autenticación

1. Primero, utiliza la solicitud "Login" con credenciales válidas
2. La respuesta contendrá un token de acceso (accessToken) y un token de actualización (refreshToken)
3. El token de acceso se guardará automáticamente en la variable `{{accessToken}}` para su uso en otras solicitudes

### Propiedades

Utiliza los endpoints disponibles para:
- Listar todas las propiedades
- Obtener detalles de una propiedad específica
- Crear nuevas propiedades
- Actualizar propiedades existentes
- Eliminar propiedades

### Usuarios

Utiliza los endpoints disponibles para:
- Listar todos los usuarios
- Obtener detalles de un usuario específico
- Crear nuevos usuarios
- Actualizar usuarios existentes
- Eliminar usuarios
- Gestionar roles de usuarios

## Estructura de datos

### Propiedades

```json
{
  "title": "Apartamento en el centro",
  "description": "Hermoso apartamento con 2 habitaciones y 1 baño",
  "price": 150000,
  "listingTypeId": 1,
  "statusId": 1,
  "propertyTypeId": 1,
  "addressId": 1
}
```

### Usuarios

```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "fullName": "Nombre Completo",
  "phone": "+1234567890"
}
```

## Consideraciones importantes

- Todas las solicitudes (excepto login y crear usuario) requieren autenticación mediante el encabezado `Authorization: Bearer {{accessToken}}`
- Si el token expira, utiliza la solicitud "Refrescar Token" para obtener uno nuevo
- Los IDs utilizados en los ejemplos son ilustrativos; asegúrate de usar IDs válidos en tu entorno

## Solución de problemas

- **Error 401 (No autorizado)**: Verifica que el token de acceso sea válido y no haya expirado
- **Error 404 (No encontrado)**: Verifica que el ID del recurso sea correcto
- **Error 400 (Solicitud incorrecta)**: Revisa el formato de los datos enviados 