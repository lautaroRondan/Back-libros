import { Request, Response } from 'express';
import upload from '../config/multerConfig';
import UserBook from '../models/UserBook';

export const uploadImage = (req: Request, res: Response) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading image', error: err });
    }

    try {
      // Asume que tienes una propiedad `isbn` en el cuerpo de la solicitud para identificar el libro
      const { isbn } = req.body;
      const imageUrl = req.file.path;

      // Encuentra el libro y actualiza su URL de imagen
      const book = await UserBook.findByIdAndUpdate(isbn, { imageUrl }, { new: true });

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      res.status(200).json({ message: 'Image uploaded and URL saved', book });
    } catch (error) {
      res.status(500).json({ message: 'Error saving image URL to database', error });
    }
  });
};
