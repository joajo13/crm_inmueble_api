interface S3Config {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region: string;
}

export const s3Config: S3Config = {
  endpoint: process.env.S3_ENDPOINT || 'https://minio.giupponi.dev',
  accessKeyId: process.env.S3_ACCESS_KEY_ID || 'GXho2m8iXGOVtktB',
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'Zod5IZEZB1IOXCq7dl65d4EJmLVEAd8j',
  bucketName: process.env.S3_BUCKET_NAME || 'public',
  region: process.env.S3_REGION || 'us-east-1'
}; 