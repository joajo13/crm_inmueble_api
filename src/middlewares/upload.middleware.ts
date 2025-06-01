import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '@/errors';

const UPLOAD_DIR = path.join(__dirname, '../../static/images/properties');

// Asegurarse de que el directorio de subida exista
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('VALIDATION_ERROR', ['Tipo de archivo no permitido. Solo se aceptan imágenes (jpeg, png, gif, webp).']));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB límite de tamaño de archivo
  },
  fileFilter: fileFilter
});

export default upload; 