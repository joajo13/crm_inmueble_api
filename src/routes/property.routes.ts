import { Router } from "express";
import PropertyController from "@/controllers/property.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import validateRequest from "@/middlewares/validateRequest.middleware";
import {
  propertyIdParamSchema,
  propertyBuildingIdParamSchema,
  createPropertySchema,
  updatePropertySchema,
} from "@/validations/property.validation";
import upload from "@/middlewares/upload.middleware";

const router = Router();

router.get("/", PropertyController.getAllProperties);
router.get(
  "/:id",
  validateRequest(propertyIdParamSchema, "params"),
  PropertyController.getPropertyById
);
router.post(
  "/",
  authMiddleware,
  upload.array("images", 10), // Acepta hasta 10 imágenes en el campo 'images'
  validateRequest(createPropertySchema, "body"), // La validación del body sigue aplicando
  PropertyController.createProperty
);
router.put(
  "/:id",
  authMiddleware,
  validateRequest(propertyIdParamSchema, "params"),
  validateRequest(updatePropertySchema, "body"),
  PropertyController.updateProperty
);
router.delete(
  "/:id",
  authMiddleware,
  validateRequest(propertyIdParamSchema, "params"),
  PropertyController.deleteProperty
);

router.get(
  "/:id/images",
  authMiddleware,
  validateRequest(propertyIdParamSchema, "params"),
  PropertyController.getImagesByPropertyId
);

// Ruta para obtener propiedades por edificio
router.get(
  "/building/:buildingId",
  authMiddleware,
  validateRequest(propertyBuildingIdParamSchema, "params"),
  PropertyController.getPropertiesByBuilding
);

// Nueva ruta para subir imágenes de una propiedad
// Se espera que la imagen venga en un campo llamado 'image' en el FormData
router.post(
  "/:id/images",
  authMiddleware,
  validateRequest(propertyIdParamSchema, "params"),
  upload.single("image"), // Middleware de Multer para un solo archivo en el campo 'image'
  PropertyController.uploadPropertyImage
);

// Nueva ruta para eliminar una imagen de una propiedad
router.delete(
  "/:id/images/:imageId",
  authMiddleware,
  upload.single("image"),
  validateRequest(propertyIdParamSchema, "params"),
  PropertyController.deletePropertyImage
);

export default router;
