import { Router } from 'express';
import { addBook, getBooks } from '../controllers/BookController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/books', authMiddleware, addBook);
router.get('/books', authMiddleware, getBooks);

export default router;
