import axios from 'axios';

export const fetchBookDetailsFromAPI = async (isbn: string) => {
  try {
    const response = await axios.get(`https://api.example.com/books?isbn=${isbn}`);
    return response.data;
  } catch (error) {
    console.error('Error al buscar detalles del libro en la API', error);
    return null;
  }
};
