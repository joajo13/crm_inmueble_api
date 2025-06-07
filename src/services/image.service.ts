import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { Image } from "@prisma/client";

const prisma = new PrismaClient();

interface ImageData {
  filePath: string;
  mimeType: string;
}

const ImageService = {
  getById: async (imageId: number) => {
    return await prisma.image.findUnique({
      where: { id: imageId },
    });
  },

  uploadPropertyImage: async (
    image: Express.Multer.File,
    propertyId: number
  ) => {
    const { path, mimetype } = image;

    const newImage = await prisma.image.create({
      data: {
        filePath: path,
        mimeType: mimetype,
        Property: { connect: { id: propertyId } },
      },
    });

    return newImage;
  },

  getImagesByPropertyId: async (propertyId: number) => {
    const images = await prisma.image.findMany({
      where: {
        Property: { id: propertyId },
      },
    });

    return images;
  },

  deleteImage: async (imageId: number) => {
    const deletedImage = await prisma.image.delete({
      where: { id: imageId },
    });

    return deletedImage;
  },
  preparePropertyImagePath: (
    propertyId: number,
    imageId: number,
    originalFilePath: string
  ): { dirPath: string; filePath: string } => {
    const dirPath = path.join(
      "static",
      "images",
      "properties",
      propertyId.toString()
    );
    const fileName = `${imageId}${path.extname(originalFilePath)}`;
    const filePath = path.join(dirPath, fileName);

    // Asegurarse de que el directorio existe
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    return { dirPath, filePath };
  },

  moveImageToProperty: (
    sourceFilePath: string,
    destinationFilePath: string
  ): void => {
    fs.renameSync(sourceFilePath, destinationFilePath);
  },

  moveImageToBuilding: (
    sourceFilePath: string,
    destinationFilePath: string
  ): void => {
    console.log("sourceFilePath", sourceFilePath);
    console.log("destinationFilePath", destinationFilePath);
    fs.renameSync(sourceFilePath, destinationFilePath);
  },

  savePropertyImage: async (
    propertyId: number,
    imageData: ImageData
  ): Promise<Image> => {
    // Primero creamos el registro en la base de datos con una ruta temporal
    const newImage = await prisma.image.create({
      data: {
        filePath: imageData.filePath, // Esta será una ruta temporal
        mimeType: imageData.mimeType,
        propertyId,
      },
    });

    // Ahora que tenemos el ID, preparamos la ruta final
    const { filePath: finalPath } = ImageService.preparePropertyImagePath(
      propertyId,
      newImage.id,
      imageData.filePath
    );

    // Actualizamos el registro con la ruta final
    return await prisma.image.update({
      where: { id: newImage.id },
      data: { filePath: finalPath },
    });
  },

  saveBuildingImage: async (
    buildingId: number,
    imageData: ImageData
  ): Promise<Image> => {
    // Primero creamos el registro en la base de datos con una ruta temporal
    const newImage = await prisma.image.create({
      data: {
        filePath: imageData.filePath, // Esta será una ruta temporal
        mimeType: imageData.mimeType,
        buildingId: buildingId,
      },
    });

    // Ahora que tenemos el ID, preparamos la ruta final
    const { filePath: finalPath } = ImageService.prepareBuildingImagePath(
      buildingId,
      newImage.id,
      imageData.filePath
    );

    // Actualizamos el registro con la ruta final
    return await prisma.image.update({
      where: { id: newImage.id },
      data: { filePath: finalPath },
    });
  },

  prepareBuildingImagePath: (
    buildingId: number,
    imageId: number,
    originalFilePath: string
  ): { dirPath: string; filePath: string } => {
    const dirPath = path.join(
      "static",
      "images",
      "buildings",
      buildingId.toString()
    );
    const fileName = `${imageId}${path.extname(originalFilePath)}`;
    const filePath = path.join(dirPath, fileName);

    // Asegurarse de que el directorio existe
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    return { dirPath, filePath };
  },

  // uploadBuildingImage: async (imageData: ImageData, buildingId: number) => {
  //   const { filePath, mimeType } = imageData;
  //   const newImage = await prisma.image.create({
  //     data: { filePath: filePath, mimeType: mimeType, buildingId: buildingId },
  //   });

  //   return newImage;
  // },

  getImagesByBuildingId: async (buildingId: number) => {
    const images = await prisma.image.findMany({
      where: { buildingId: buildingId },
    });

    return images;
  },

  deleteBuildingImage: async (imageId: number) => {
    const deletedImage = await prisma.image.delete({
      where: { id: imageId },
    });

    return deletedImage;
  },
};

export default ImageService;

// if (images && images.length > 0) {
//     const imageCreations = images.map((img: { filePath: string; mimeType: string }) => {
//       return tx.image.create({
//         data: {
//           filePath: img.filePath,
//           mimeType: img.mimeType,
//           Property: { connect: { id: newProperty.id } }
//         }
//       });
//     });
//     await Promise.all(imageCreations);
//   }
