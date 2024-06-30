import { Router } from 'express';
import { searchBookByISBN, addBookManually, getBooks } from '../controllers/BookController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/search',authMiddleware, searchBookByISBN);
router.post('/add', authMiddleware, addBookManually);
router.get('/books', authMiddleware, getBooks);

export default router;
