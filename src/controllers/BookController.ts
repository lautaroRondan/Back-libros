import { Request, Response } from 'express';
import Book from '../models/Book';
import { fetchBookDetailsFromAPI } from '../utils/ApiHelper';

interface AuthRequest extends Request {
  user?: { id: string }; // Definir la propiedad 'user' y su tipo
}

export const addBook = async (req: AuthRequest, res: Response) => {
  const { isbn, titulo, autor, editorial, formato } = req.body;
  const usuarioCreador = req.user?.id; // Acceder a la propiedad 'user' de manera segura

  if (!usuarioCreador) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }

  try {
    const book = new Book({ isbn, titulo, autor, editorial, formato, usuarioCreador });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el libro', error });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find().populate('usuarioCreador', 'username');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los libros', error });
  }
};
