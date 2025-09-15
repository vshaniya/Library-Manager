import axios from 'axios';

const API_URL = 'http://localhost:5000/api/books';

export const getBooks = () => axios.get(API_URL);
export const getBook = (id) => axios.get(`${API_URL}/${id}`);
export const createBook = (book) => axios.post(API_URL, book);
export const updateBook = (id, book) => axios.put(`${API_URL}/${id}`, book);
export const deleteBook = (id) => axios.delete(`${API_URL}/${id}`);
