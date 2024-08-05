import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Libros', // Cambia esto al nombre del folder donde quieres almacenar las imágenes
    format: async () => 'jpeg', // Puedes cambiar el formato si lo deseas
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

export default upload;
