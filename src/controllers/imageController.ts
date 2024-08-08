import { Request, Response } from 'express';
import UserBook from '../models/UserBook';
import upload from '../config/multerConfig';

export const uploadImage = async (req: Request, res: Response) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading image', error: err });
    }

    try {
      const imageUrl = req.file?.path;
      if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL not found' });
      }

      const { isbn } = req.body;
      if (!isbn) {
        return res.status(400).json({ message: 'Missing ISBN' });
      }

      // Verifica la existencia del libro
      const existingBook = await UserBook.findOne({
        isbn,
        usuarioCreador: req.user?.id
      });

      if (!existingBook) {
        return res.status(404).json({ message: 'Book not found isbn id', imageUrl });
      }

      // Actualiza el libro en la base de datos con la URL de la imagen
      const updatedBook = await UserBook.findOneAndUpdate(
        { isbn, usuarioCreador: req.user?.id },
        { imageUrl },
        { new: true }
      );
      console.log("aa: ", updatedBook)

      if (!updatedBook) {
        return res.status(404).json({ message: 'Book not found', imageUrl });
      }

      res.status(200).json({ message: 'Image uploaded and URL updated successfully', updatedBook });
    } catch (error) {
      res.status(500).json({ message: 'Error processing image and updating book', error });
    }
  });
};
