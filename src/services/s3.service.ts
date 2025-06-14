import AWS from 'aws-sdk';
import path from 'path';
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
   * Sube una imagen de propiedad al bucket
   */
  async uploadPropertyImage(
    propertyId: number,
    imageId: number,
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<string> {
    const extension = path.extname(originalName);
    const key = `ricci/images/properties/${propertyId}/${imageId}${extension}`;
    
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      // Para que sea público de lectura
      ACL: 'public-read'
    };

    await this.s3.upload(params).promise();
    
    // Retornar la URL pública
    return `${s3Config.endpoint}/${this.bucketName}/${key}`;
  }

  /**
   * Sube una imagen de edificio al bucket
   */
  async uploadBuildingImage(
    buildingId: number,
    imageId: number,
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<string> {
    const extension = path.extname(originalName);
    const key = `ricci/images/buildings/${buildingId}/${imageId}${extension}`;
    
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: 'public-read'
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
    // URL format: https://minio.giupponi.dev/public/images/properties/1/1.jpg
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
}

export default new S3Service(); 