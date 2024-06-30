import mongoose, { Document, Schema } from 'mongoose';

interface ILocalBook extends Document {
  isbn: string;
  titulo: string;
  autor: string;
  editorial: string;
  formato: string;
}

const LocalBookSchema: Schema = new Schema({
  isbn: { type: String, required: true, unique: true },
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  editorial: { type: String, required: true },
});

export default mongoose.model<ILocalBook>('LocalBook', LocalBookSchema);
