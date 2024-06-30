import { Request, Response } from 'express';
import LocalBook from '../models/LocalBook';
import UserBook from '../models/UserBook';
import { fetchBookDetailsFromAPI } from '../utils/ApiHelper';

export const searchBookByISBN = async (req: Request, res: Response) => {
  const { isbn } = req.body;
  const usuarioCreador = req.user?.id;

  try {
    let book = await LocalBook.findOne({ isbn });

    if (book) {
      // Verificar si el libro ya está en la base de datos del usuario
      const existingUserBook = await UserBook.findOne({ isbn, usuarioCreador });
      if (existingUserBook) {
        return res.json(existingUserBook);
      }

      // Si no está, agregarlo a la base de datos del usuario
      const newUserBook = new UserBook({ ...book.toObject(), isbn, usuarioCreador });
      await newUserBook.save();
      return res.json(newUserBook);
    }

    const bookDetails = await fetchBookDetailsFromAPI(isbn);
    if (bookDetails) {
      book = new LocalBook({ ...bookDetails, isbn });
      await book.save();

      const newUserBook = new UserBook({ ...bookDetails, isbn, usuarioCreador });
      await newUserBook.save();
      return res.json(newUserBook);
    }

    return res.status(404).json({ message: 'Book not found in external API or local database' });
  } catch (error) {
    console.error('Error searching book by ISBN:', error);
    return res.status(500).json({ message: 'Error searching book by ISBN', error });
  }
};

export const addBookManually = async (req: Request, res: Response) => {
  const { isbn, titulo, autor, editorial, formato } = req.body;
  const usuarioCreador = req.user?.id;

  try {
    let localBook = await LocalBook.findOne({ isbn });
    if (!localBook) {
      localBook = new LocalBook({ isbn, titulo, autor, editorial });
      await localBook.save();
    }

    const existingUserBook = await UserBook.findOne({ isbn, usuarioCreador });
    if (existingUserBook) {
      return res.status(400).json({ message: 'This book is already in your collection' });
    }

    const userBook = new UserBook({ isbn, titulo, autor, editorial, formato, usuarioCreador, reseñas: [], estadoLectura: [] });
    await userBook.save();

    res.status(201).json(userBook);
  } catch (error) {
    res.status(500).json({ message: 'Error adding book manually', error });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const userBooks = await UserBook.find({ usuarioCreador: req.user?.id }).populate('usuarioCreador', 'username');
    res.json(userBooks);
  } catch (error) {
    res.status(500).json({ message: 'Error getting books', error });
  }
};
