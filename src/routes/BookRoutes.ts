import { Router } from 'express';
import { searchBookByISBN, addBookManually, getBooks, updateUserBook } from '../controllers/BookController';
import authMiddleware from '../middlewares/authMiddleware';
import { uploadImage } from '../controllers/imageController';

const router = Router();

router.post('/search',authMiddleware, searchBookByISBN);
router.post('/add', authMiddleware, addBookManually);
router.get('/books', authMiddleware, getBooks);
router.put('/userbook/:id', authMiddleware, updateUserBook);
router.post('/upload', authMiddleware, uploadImage);

export default router;
