import { Schema, model, Document } from 'mongoose';

interface IReview {
  usuario: string;
  texto: string;
  puntuacion: number;
}

interface IEstadoLectura {
  usuario: string;
  leido: boolean;
}

interface IUserBook extends Document {
  isbn: string;
  titulo: string;
  autor: string;
  editorial: string;
  formato: string;
  usuarioCreador: string;
  reseñas: IReview[];
  estadoLectura: IEstadoLectura[];
}

const bookSchema = new Schema<IUserBook>({
  isbn: { type: String, required: true },
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  editorial: { type: String, required: true },
  formato: { type: String },
  usuarioCreador: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reseñas: [
    {
      usuario: { type: Schema.Types.ObjectId, ref: 'User' },
      texto: String,
      puntuacion: Number
    }
  ],
  estadoLectura: [
    {
      usuario: { type: Schema.Types.ObjectId, ref: 'User' },
      leido: Boolean
    }
  ]
});

export default model<IUserBook>('Book', bookSchema);
