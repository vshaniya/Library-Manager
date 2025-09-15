
import React, { useEffect, useState } from 'react';
import { getBooks, createBook, updateBook, deleteBook } from '../api/books';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack
} from '@mui/material';

const initialForm = { title: '', author_id: '', published_year: '', isbn: '' };

export default function BookManager() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      setBooks([]);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateBook(editingId, form);
      } else {
        console.log('Creating book with data:', form);
        await createBook(form);
      }
      setForm(initialForm);
      setEditingId(null);
      fetchBooks();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = book => {
    setForm({
      title: book.title,
      author_id: book.author_id,
      published_year: book.published_year,
      isbn: book.isbn
    });
    setEditingId(book.id);
  };

  const handleDelete = async id => {
    await deleteBook(id);
    fetchBooks();
  };

  return (
    <Box maxWidth={700} mx="auto" mt={4}>
      <Typography variant="h4" align="center" gutterBottom>Books</Typography>
      <Box component="form" onSubmit={handleSubmit} mb={3} p={2} borderRadius={2} boxShadow={2} bgcolor="#fafafa">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField
            name="title"
            label="Title"
            value={form.title}
            onChange={handleChange}
            required
            size="small"
          />
          <TextField
            name="author_id"
            label="Author ID"
            value={form.author_id}
            onChange={handleChange}
            required
            size="small"
          />
          <TextField
            name="published_year"
            label="Year"
            value={form.published_year}
            onChange={handleChange}
            size="small"
          />
          <TextField
            name="isbn"
            label="ISBN"
            value={form.isbn}
            onChange={handleChange}
            size="small"
          />
          <Button type="submit" variant="contained" color="primary">
            {editingId ? 'Update' : 'Add'}
          </Button>
          {editingId && (
            <Button type="button" variant="outlined" color="secondary" onClick={() => { setForm(initialForm); setEditingId(null); }}>
              Cancel
            </Button>
          )}
        </Stack>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author ID</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map(book => (
              <TableRow key={book.id}>
                <TableCell>{book.id}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author_id}</TableCell>
                <TableCell>{book.published_year}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell align="center">
                  <Button size="small" variant="outlined" color="primary" onClick={() => handleEdit(book)} sx={{ mr: 1 }}>Edit</Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(book.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
