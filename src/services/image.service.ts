import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { Image } from "@prisma/client";
import S3Service from "./s3.service";
import { s3Config } from "@/config/s3.config";

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

  /**
   * Guarda una imagen de propiedad en S3 y en la base de datos
   */
  savePropertyImage: async (
    propertyId: number,
    file: Express.Multer.File
  ): Promise<Image> => {
    // Primero creamos el registro en la base de datos para obtener el ID
    const newImage = await prisma.image.create({
      data: {
        filePath: '', // Se actualizará después
        mimeType: file.mimetype.startsWith('image/') ? 'image/webp' : file.mimetype, // Se convierte a WebP
        propertyId,
      },
    });

    try {
      // Leer el archivo temporal
      const buffer = fs.readFileSync(file.path);
      
      // Subir a S3 (se convierte automáticamente a WebP)
      const s3Url = await S3Service.uploadPropertyImage(
        propertyId,
        newImage.id,
        buffer,
        file.originalname,
        file.mimetype
      );

      // Actualizar el registro con la URL de S3
      const updatedImage = await prisma.image.update({
        where: { id: newImage.id },
        data: { filePath: s3Url },
      });

      // Limpiar el archivo temporal
      fs.unlinkSync(file.path);

      return updatedImage;
    } catch (error) {
      // Si falla, eliminar el registro de la base de datos
      await prisma.image.delete({ where: { id: newImage.id } });
      throw error;
    }
  },

  /**
   * Guarda una imagen de edificio en S3 y en la base de datos
   */
  saveBuildingImage: async (
    buildingId: number,
    file: Express.Multer.File
  ): Promise<Image> => {
    // Primero creamos el registro en la base de datos para obtener el ID
    const newImage = await prisma.image.create({
      data: {
        filePath: '', // Se actualizará después
        mimeType: file.mimetype.startsWith('image/') ? 'image/webp' : file.mimetype, // Se convierte a WebP
        buildingId: buildingId,
      },
    });

    try {
      // Leer el archivo temporal
      const buffer = fs.readFileSync(file.path);
      
      // Subir a S3 (se convierte automáticamente a WebP)
      const s3Url = await S3Service.uploadBuildingImage(
        buildingId,
        newImage.id,
        buffer,
        file.originalname,
        file.mimetype
      );

      // Actualizar el registro con la URL de S3
      const updatedImage = await prisma.image.update({
        where: { id: newImage.id },
        data: { filePath: s3Url },
      });

      // Limpiar el archivo temporal
      fs.unlinkSync(file.path);

      return updatedImage;
    } catch (error) {
      // Si falla, eliminar el registro de la base de datos
      await prisma.image.delete({ where: { id: newImage.id } });
      throw error;
    }
  },

  /**
   * Guarda una imagen de propiedad con múltiples tamaños (original, medium, thumbnail)
   * OPCIONAL: Método avanzado para generar thumbnails automáticamente
   */
  savePropertyImageWithThumbnails: async (
    propertyId: number,
    file: Express.Multer.File
  ): Promise<Image> => {
    // Primero creamos el registro en la base de datos para obtener el ID
    const newImage = await prisma.image.create({
      data: {
        filePath: '', // Se actualizará después
        mimeType: 'image/webp',
        propertyId,
      },
    });

    try {
      // Leer el archivo temporal
      const buffer = fs.readFileSync(file.path);
      
      // Subir con múltiples tamaños
      const urls = await S3Service.uploadImageWithThumbnails(
        'property',
        propertyId,
        newImage.id,
        buffer,
        file.originalname,
        file.mimetype
      );

      // Actualizar el registro con la URL original (puedes guardar también los thumbnails en campos adicionales)
      const updatedImage = await prisma.image.update({
        where: { id: newImage.id },
        data: { 
          filePath: urls.original,
          // Si tu esquema tiene campos para thumbnails, puedes agregarlos aquí:
          // thumbnailUrl: urls.thumbnail,
          // mediumUrl: urls.medium
        },
      });

      // Limpiar el archivo temporal
      fs.unlinkSync(file.path);

      return updatedImage;
    } catch (error) {
      // Si falla, eliminar el registro de la base de datos
      await prisma.image.delete({ where: { id: newImage.id } });
      throw error;
    }
  },

  /**
   * Guarda una imagen de edificio con múltiples tamaños (original, medium, thumbnail)
   * OPCIONAL: Método avanzado para generar thumbnails automáticamente
   */
  saveBuildingImageWithThumbnails: async (
    buildingId: number,
    file: Express.Multer.File
  ): Promise<Image> => {
    // Primero creamos el registro en la base de datos para obtener el ID
    const newImage = await prisma.image.create({
      data: {
        filePath: '', // Se actualizará después
        mimeType: 'image/webp',
        buildingId: buildingId,
      },
    });

    try {
      // Leer el archivo temporal
      const buffer = fs.readFileSync(file.path);
      
      // Subir con múltiples tamaños
      const urls = await S3Service.uploadImageWithThumbnails(
        'building',
        buildingId,
        newImage.id,
        buffer,
        file.originalname,
        file.mimetype
      );

      // Actualizar el registro con la URL original
      const updatedImage = await prisma.image.update({
        where: { id: newImage.id },
        data: { 
          filePath: urls.original,
          // Si tu esquema tiene campos para thumbnails, puedes agregarlos aquí:
          // thumbnailUrl: urls.thumbnail,
          // mediumUrl: urls.medium
        },
      });

      // Limpiar el archivo temporal
      fs.unlinkSync(file.path);

      return updatedImage;
    } catch (error) {
      // Si falla, eliminar el registro de la base de datos
      await prisma.image.delete({ where: { id: newImage.id } });
      throw error;
    }
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

  getImagesByBuildingId: async (buildingId: number) => {
    const images = await prisma.image.findMany({
      where: { buildingId: buildingId },
    });

    return images;
  },

  deleteBuildingImage: async (imageId: number) => {
    const image = await prisma.image.findUnique({
      where: { id: imageId }
    });

    if (!image) {
      throw new Error('Imagen no encontrada');
    }

    // Si la imagen está en S3 (contiene la URL del endpoint), eliminarla de S3
    if (image.filePath.startsWith(s3Config.endpoint)) {
      await S3Service.deleteImage(image.filePath);
    } else {
      // Si es una imagen local (legacy), eliminar del filesystem
      try {
        fs.unlinkSync(image.filePath);
      } catch (error) {
        console.warn(`No se pudo eliminar el archivo local: ${image.filePath}`);
      }
    }

    // Eliminar de la base de datos
    const deletedImage = await prisma.image.delete({
      where: { id: imageId },
    });

    return deletedImage;
  },

  deletePropertyImage: async (imageId: number) => {
    const image = await prisma.image.findUnique({
      where: { id: imageId }
    });

    if (!image) {
      throw new Error('Imagen no encontrada');
    }

    // Si la imagen está en S3 (contiene la URL del endpoint), eliminarla de S3
    if (image.filePath.startsWith(s3Config.endpoint)) {
      await S3Service.deleteImage(image.filePath);
    } else {
      // Si es una imagen local (legacy), eliminar del filesystem
      try {
        fs.unlinkSync(image.filePath);
      } catch (error) {
        console.warn(`No se pudo eliminar el archivo local: ${image.filePath}`);
      }
    }

    // Eliminar de la base de datos
    const deletedImage = await prisma.image.delete({
      where: { id: imageId },
    });

    return deletedImage;
  },
};

export default ImageService;
