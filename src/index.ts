import express, { Application } from 'express';
import connectDB from './utils/bd/DateBase';
import cors from 'cors';
import authRoutes from './routes/AuthRoutes';
import bookRoutes from './routes/BookRoutes';

const app: Application = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', bookRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
