import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => ({
    public_id: file.originalname.split('.')[0],
    folder: 'Libros',
    transformation: [{ format: 'jpeg' }] // Definir la transformación aquí si es necesario
  }),
});

const upload = multer({ storage: storage });

export default upload;
