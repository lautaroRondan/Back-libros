import { Schema, model, Document } from 'mongoose';

interface IReview {
  texto: string;
  puntuacion: number; 
}

interface IUserBook extends Document {
  isbn: string;
  titulo: string;
  autor: string;
  editorial: string;
  formato?: string;
  usuarioCreador: string;
  reseñas: IReview[];
  estadoLectura: boolean; 
  imageUrl: string;
}

const reviewSchema = new Schema<IReview>({
  texto: { type: String },
  puntuacion: { type: Number, min: 1, max: 5 }
});

const userBookSchema = new Schema<IUserBook>({
  isbn: { type: String, required: true },
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  editorial: { type: String, required: true },
  formato: { type: String },
  usuarioCreador: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reseñas: [reviewSchema],
  estadoLectura: { type: Boolean, required: true },
  imageUrl: {type: String}
});

export default model<IUserBook>('UserBook', userBookSchema);
