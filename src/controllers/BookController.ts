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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    console.log('ID del usuario autenticado:', req.user.id);

    const userBooks = await UserBook.find({ usuarioCreador: req.user.id });

    console.log('Libros encontrados para el ID', req.user.id, ':', userBooks);

    res.json(userBooks);
  } catch (error) {
    console.error('Error al obtener los libros:', error);
    res.status(500).json({ message: 'Error getting books', error });
  }
};

export const getBooksByAuthToken = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const userId = req.user.id;
    console.log('Buscando libros para el ID del usuario autenticado:', userId);

    const userBooks = await UserBook.find({ usuarioCreador: userId });

    console.log('Libros encontrados para el ID', userId, ':', userBooks);

    if (userBooks.length === 0) {
      return res.status(404).json({ message: 'No se encontraron libros para este usuario' });
    }

    res.json(userBooks);
  } catch (error) {
    console.error('Error al obtener los libros por token:', error);
    res.status(500).json({ message: 'Error getting books by token', error });
  }
};



export const updateUserBook = async (req: Request, res: Response) => {
  const { id } = req.params; // ID del UserBook
  const { formato, reseñas, estadoLectura } = req.body;
  const usuarioCreador = req.user?.id;

  try {
    let userBook = await UserBook.findOne({ _id: id, usuarioCreador });
    if (!userBook) {
      return res.status(404).json({ message: 'User book not found' });
    }

    // Actualiza solo los campos permitidos
    if (formato) {
      userBook.formato = formato;
    }

    if (reseñas) {
      userBook.reseñas = reseñas.map((resena: { texto: string; puntuacion: number }) => ({
        ...resena,
        usuario: usuarioCreador // Asigna el usuarioCreador a cada reseña
      }));
    }

    if (estadoLectura !== undefined) {
      userBook.estadoLectura = estadoLectura;
    }

    await userBook.save();

    res.json(userBook);
  } catch (error) {
    console.error('Error updating user book:', error);
    res.status(500).json({ message: 'Error updating user book', error });
  }
};