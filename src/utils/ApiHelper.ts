import axios from 'axios';

const GOOGLE_BOOKS_API_KEY = 'AIzaSyBoSJbDPWWLrv9GaFMjGxF7yn_kONbWKL0'; // Reemplaza con tu clave de API
export const fetchBookDetailsFromAPI = async (isbn: string) => {
  try {
    console.log(isbn)
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_BOOKS_API_KEY}`);
    const bookInfo = response.data.items?.[0]?.volumeInfo;

    if (!bookInfo) {
      console.error(`Book not found for ISBN: ${isbn}`, response.data);
      throw new Error(`Book not found for ISBN: ${isbn}`);
    }

    const bookDetails = {
      titulo: bookInfo.title,
      autor: bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author',
      editorial: bookInfo.publisher || 'Unknown Publisher'
    };

    return bookDetails;
  } catch (error) {
    console.error('Error fetching book details from API:', error);
    throw new Error('Error fetching book details');
  }
};

