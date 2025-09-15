import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Books API
export const getBooks = () => axios.get(`${API_BASE_URL}/books`);
export const getBook = (id) => axios.get(`${API_BASE_URL}/books/${id}`);
export const createBook = (book) => axios.post(`${API_BASE_URL}/books`, book);
export const updateBook = (id, book) => axios.put(`${API_BASE_URL}/books/${id}`, book);
export const deleteBook = (id) => axios.delete(`${API_BASE_URL}/books/${id}`);

// Authors API
export const getAuthors = () => axios.get(`${API_BASE_URL}/authors`);
export const createAuthor = (author) => axios.post(`${API_BASE_URL}/authors`, author);

// Borrowers API
export const getBorrowers = () => axios.get(`${API_BASE_URL}/borrowers`);
export const createBorrower = (borrower) => axios.post(`${API_BASE_URL}/borrowers`, borrower);

// Loans API
export const getLoans = () => axios.get(`${API_BASE_URL}/loans`);
export const getActiveLoans = () => axios.get(`${API_BASE_URL}/loans/active`);
export const createLoan = (loan) => axios.post(`${API_BASE_URL}/loans`, loan);
export const returnBook = (loanId) => axios.put(`${API_BASE_URL}/loans/${loanId}/return`);