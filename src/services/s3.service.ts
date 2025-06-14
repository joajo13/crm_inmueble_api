import AWS from 'aws-sdk';
import path from 'path';
import sharp from 'sharp';
import { s3Config } from '@/config/s3.config';

class S3Service {
  private s3: AWS.S3;
  private bucketName: string;

  constructor() {
    this.s3 = new AWS.S3({
      endpoint: s3Config.endpoint,
      accessKeyId: s3Config.accessKeyId,
      secretAccessKey: s3Config.secretAccessKey,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
      region: s3Config.region
    });
    this.bucketName = s3Config.bucketName;
  }

  /**
   * Convierte una imagen a WebP y la optimiza
   */
  private async convertToWebP(buffer: Buffer, quality: number = 80): Promise<Buffer> {
    return await sharp(buffer)
      .webp({ 
        quality,
        effort: 4 // Balance entre compresión y velocidad (0-6)
      })
      .toBuffer();
  }

  /**
   * Sube una imagen de propiedad al bucket (convertida a WebP)
   */
  async uploadPropertyImage(
    propertyId: number,
    imageId: number,
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<string> {
    // Convertir a WebP solo si es una imagen
    let processedBuffer = buffer;
    let finalMimeType = mimeType;
    
    if (mimeType.startsWith('image/')) {
      processedBuffer = await this.convertToWebP(buffer);
      finalMimeType = 'image/webp';
    }

    // Usar extensión .webp para imágenes convertidas
    const key = `ricci/images/properties/${propertyId}/${imageId}.webp`;
    
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: processedBuffer,
      ContentType: finalMimeType,
      // Para que sea público de lectura
      ACL: 'public-read',
      // Headers adicionales para optimización
      CacheControl: 'max-age=31536000', // Cache por 1 año
      ContentDisposition: 'inline'
    };

    await this.s3.upload(params).promise();
    
    // Retornar la URL pública
    return `${s3Config.endpoint}/${this.bucketName}/${key}`;
  }

  /**
   * Sube una imagen de edificio al bucket (convertida a WebP)
   */
  async uploadBuildingImage(
    buildingId: number,
    imageId: number,
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<string> {
    // Convertir a WebP solo si es una imagen
    let processedBuffer = buffer;
    let finalMimeType = mimeType;
    
    if (mimeType.startsWith('image/')) {
      processedBuffer = await this.convertToWebP(buffer);
      finalMimeType = 'image/webp';
    }

    // Usar extensión .webp para imágenes convertidas
    const key = `ricci/images/buildings/${buildingId}/${imageId}.webp`;
    
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: processedBuffer,
      ContentType: finalMimeType,
      ACL: 'public-read',
      // Headers adicionales para optimización
      CacheControl: 'max-age=31536000', // Cache por 1 año
      ContentDisposition: 'inline'
    };

    await this.s3.upload(params).promise();
    
    // Retornar la URL pública
    return `${s3Config.endpoint}/${this.bucketName}/${key}`;
  }

  /**
   * Elimina una imagen del bucket
   */
  async deleteImage(imageUrl: string): Promise<void> {
    // Extraer la key de la URL
    // URL format: https://minio.giupponi.dev/public/ricci/images/properties/1/1.webp
    const baseUrl = `${s3Config.endpoint}/${this.bucketName}/`;
    if (!imageUrl.startsWith(baseUrl)) {
      throw new Error(`URL de imagen inválida: ${imageUrl}`);
    }
    
    const key = imageUrl.replace(baseUrl, '');
    
    const params = {
      Bucket: this.bucketName,
      Key: key
    };

    await this.s3.deleteObject(params).promise();
  }

  /**
   * Método utilitario para obtener la URL pública de una imagen
   */
  getPublicUrl(key: string): string {
    return `${s3Config.endpoint}/${this.bucketName}/${key}`;
  }

  /**
   * Genera múltiples tamaños de una imagen (thumbnails)
   * Útil para generar diferentes resoluciones
   */
  async uploadImageWithThumbnails(
    type: 'property' | 'building',
    entityId: number,
    imageId: number,
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<{ original: string; thumbnail: string; medium: string }> {
    if (!mimeType.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }

    const baseKey = `ricci/images/${type}s/${entityId}/${imageId}`;
    
    // Generar diferentes tamaños
    const [originalBuffer, thumbnailBuffer, mediumBuffer] = await Promise.all([
      this.convertToWebP(buffer, 85), // Calidad alta para original
      sharp(buffer).resize(300, 300, { fit: 'cover' }).webp({ quality: 75 }).toBuffer(), // Thumbnail
      sharp(buffer).resize(800, 600, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer() // Mediano
    ]);

    // Subir todos los tamaños
    const uploads = [
      { key: `${baseKey}.webp`, buffer: originalBuffer, suffix: 'original' },
      { key: `${baseKey}_thumb.webp`, buffer: thumbnailBuffer, suffix: 'thumbnail' },
      { key: `${baseKey}_medium.webp`, buffer: mediumBuffer, suffix: 'medium' }
    ];

    const uploadPromises = uploads.map(({ key, buffer }) => 
      this.s3.upload({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: 'image/webp',
        ACL: 'public-read',
        CacheControl: 'max-age=31536000',
        ContentDisposition: 'inline'
      }).promise()
    );

    await Promise.all(uploadPromises);

    return {
      original: `${s3Config.endpoint}/${this.bucketName}/${baseKey}.webp`,
      thumbnail: `${s3Config.endpoint}/${this.bucketName}/${baseKey}_thumb.webp`,
      medium: `${s3Config.endpoint}/${this.bucketName}/${baseKey}_medium.webp`
    };
  }
}

export default new S3Service(); 