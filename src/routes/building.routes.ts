import { Router } from "express";
import { buildingController } from "@/controllers/building.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import validateRequest from "@/middlewares/validateRequest.middleware";
import {
  buildingCreateSchema,
  buildingIdParamSchema,
  buildingUpdateSchema,
} from "@/validations";
import upload from "@/middlewares/upload.middleware";

const router = Router();

// Rutas base para edificios
router.post(
  "/",
  authMiddleware,
  upload.array("images", 10),
  validateRequest(buildingCreateSchema),
  buildingController.createBuilding
);
router.get("/", authMiddleware, buildingController.getAllBuildings);
router.get(
  "/:id",
  authMiddleware,
  validateRequest(buildingIdParamSchema, "params"),
  buildingController.getBuildingById
);
router.put(
  "/:id",
  [
    authMiddleware,
    validateRequest(buildingUpdateSchema),
    validateRequest(buildingIdParamSchema, "params"),
  ],
  buildingController.updateBuilding
);
router.delete(
  "/:id",
  authMiddleware,
  validateRequest(buildingIdParamSchema, "params"),
  buildingController.deleteBuilding
);

// Rutas para relaciones
router.get(
  "/:id/properties",
  authMiddleware,
  validateRequest(buildingIdParamSchema, "params"),
  buildingController.getBuildingProperties
);

router.get(
  "/:id/images",
  authMiddleware,
  validateRequest(buildingIdParamSchema, 'params'),
  buildingController.getBuildingImages
)
router.post(
  "/:id/images",
  authMiddleware,
  upload.single('image'),
  validateRequest(buildingIdParamSchema, 'params'),
  buildingController.uploadBuildingImage
)

router.delete(
  "/:id/images/:imageId",
  authMiddleware,
  validateRequest(buildingIdParamSchema, 'params'),
  buildingController.deleteBuildingImage
)

export default router;
