import React, { useEffect, useState } from 'react';
import { getBooks, getAuthors, createBook, updateBook, deleteBook, createAuthor } from '../api/api';
import BorrowDialog from './BorrowDialog';
import {
  Box, Typography, TextField, Button, Grid, Card, CardMedia, CardContent, CardActions,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, MenuItem, Alert, Snackbar,
  Chip, IconButton, Autocomplete
} from '@mui/material';
import { Add, Edit, Delete, MenuBook } from '@mui/icons-material';

const initialForm = { 
  title: '', 
  author_input: '', 
  author_id: '', 
  description: '',
  publication_year: '', 
  isbn: '', 
  genre: '',
  pages: '',
  image_url: '' 
};

export default function BookManager() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [borrowDialogOpen, setBorrowDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      setBooks([]);
      setError('Failed to fetch books');
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await getAuthors();
      setAuthors(res.data);
    } catch (err) {
      setAuthors([]);
    }
  };

  useEffect(() => { 
    fetchBooks(); 
    fetchAuthors();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      // Basic validation
      if (!form.title.trim()) {
        setError('Please enter a book title');
        return;
      }
      
      let authorId = form.author_id;
      
      // If no author_id is selected but author_input has a value, create new author
      if (!authorId && form.author_input) {
        // Check if author already exists
        const existingAuthor = authors.find(author => 
          author.name.toLowerCase() === form.author_input.toLowerCase()
        );
        
        if (existingAuthor) {
          authorId = existingAuthor.id;
        } else {
          // Create new author
          console.log('Creating new author:', form.author_input);
          const newAuthorResponse = await createAuthor({ name: form.author_input });
          authorId = newAuthorResponse.data.id;
          console.log('New author created with ID:', authorId);
          // Refresh authors list
          await fetchAuthors();
        }
      }
      
      if (!authorId) {
        setError('Please select or enter an author name');
        return;
      }
      
      const bookData = {
        title: form.title.trim(),
        author_id: parseInt(authorId),
        description: form.description.trim() || undefined,
        publication_year: form.publication_year ? parseInt(form.publication_year) : undefined,
        isbn: form.isbn.trim() || undefined,
        genre: form.genre.trim() || undefined,
        pages: form.pages ? parseInt(form.pages) : undefined,
        image_url: form.image_url.trim() || undefined
      };
      
      // Remove undefined values
      Object.keys(bookData).forEach(key => bookData[key] === undefined && delete bookData[key]);
      
      console.log('Submitting book data:', bookData);
      
      if (editingId) {
        const response = await updateBook(editingId, bookData);
        console.log('Book updated:', response.data);
        setSuccess('Book updated successfully!');
      } else {
        const response = await createBook(bookData);
        console.log('Book created:', response.data);
        setSuccess('Book added successfully!');
      }
      
      setForm(initialForm);
      setEditingId(null);
      setDialogOpen(false);
      await fetchBooks();
    } catch (err) {
      console.error('Error submitting book:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save book';
      setError(errorMessage);
    }
  };

  const handleEdit = book => {
    const selectedAuthor = authors.find(author => author.id === book.author_id);
    setForm({
      title: book.title,
      author_id: book.author_id,
      author_input: selectedAuthor ? selectedAuthor.name : '',
      description: book.description || '',
      publication_year: book.publication_year || '',
      isbn: book.isbn || '',
      genre: book.genre || '',
      pages: book.pages || '',
      image_url: book.image_url || ''
    });
    setEditingId(book.id);
    setDialogOpen(true);
  };

  const handleDelete = async id => {
    const book = books.find(b => b.id === id);
    const bookTitle = book ? book.title : 'this book';
    
    if (window.confirm(`Are you sure you want to delete "${bookTitle}"?\n\nNote: Books with loan history cannot be deleted.`)) {
      try {
        await deleteBook(id);
        setSuccess('Book deleted successfully!');
        fetchBooks();
      } catch (err) {
        console.error('Delete error:', err);
        const errorMessage = err.response?.data?.error || 'Failed to delete book';
        setError(errorMessage);
      }
    }
  };

  const handleBorrow = (book) => {
    setSelectedBook(book);
    setBorrowDialogOpen(true);
  };

  const handleBorrowSuccess = () => {
    setSuccess('Book borrowed successfully!');
    fetchBooks();
  };

  const handleAddNew = () => {
    setForm(initialForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #6a4c93 0%, #1b1464 100%)',
      minHeight: '100vh',
      p: 3,
      borderRadius: 2
    }}>
      <Box sx={{ p: 3, background: 'rgba(255,255,255,0.95)', borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center">
            <MenuBook sx={{ mr: 2, color: '#6a4c93', fontSize: 40 }} />
            <Typography variant="h4" sx={{ 
              background: 'linear-gradient(45deg, #6a4c93, #1b1464)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 'bold'
            }}>
              Library Books
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddNew}
            sx={{ 
              background: 'linear-gradient(45deg, #6a4c93, #1b1464)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1b1464, #6a4c93)',
              }
            }}
          >
            Add Book
          </Button>
        </Box>

        <Grid container spacing={3}>
          {books.map(book => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  background: book.available 
                    ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
                    : 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 25px rgba(106, 76, 147, 0.3)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={book.image_url || 'https://via.placeholder.com/150x200?text=No+Image'}
                  alt={book.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" noWrap sx={{ 
                    fontWeight: 'bold',
                    color: '#1b1464'
                  }}>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {book.author_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    📅 Published: {book.publication_year || 'Unknown'}
                  </Typography>
                  {book.isbn && (
                    <Typography variant="caption" display="block">
                      📚 ISBN: {book.isbn}
                    </Typography>
                  )}
                  <Box mt={1}>
                    <Chip 
                      label={book.available ? '✅ Available' : '❌ Borrowed'} 
                      color={book.available ? 'success' : 'error'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton 
                    size="small" 
                    onClick={() => handleEdit(book)}
                    sx={{ 
                      background: 'linear-gradient(45deg, #6a4c93, #1b1464)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1b1464, #6a4c93)',
                      }
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDelete(book.id)}
                    sx={{ 
                      background: 'linear-gradient(45deg, #ff6b6b, #ee5a6f)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #ee5a6f, #ff6b6b)',
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                  {book.available && (
                    <Button 
                      size="small" 
                      startIcon={<MenuBook />}
                      onClick={() => handleBorrow(book)}
                      sx={{ 
                        background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #feca57, #ff6b6b)',
                        }
                      }}
                    >
                      Borrow
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{
            background: 'linear-gradient(45deg, #6a4c93, #1b1464)',
            color: 'white'
          }}>
            {editingId ? 'Edit Book' : 'Add New Book'}
          </DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                name="title"
                label="Title"
                value={form.title}
                onChange={handleChange}
                required
                fullWidth
              />
              <Autocomplete
                options={authors}
                getOptionLabel={(option) => option.name || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={authors.find(author => author.id === form.author_id) || null}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setForm({ ...form, author_id: newValue.id, author_input: newValue.name });
                  } else {
                    setForm({ ...form, author_id: '', author_input: '' });
                  }
                }}
                inputValue={form.author_input}
                onInputChange={(event, newInputValue) => {
                  setForm({ ...form, author_input: newInputValue, author_id: '' });
                }}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Author Name"
                    placeholder="Select existing author or type new author name"
                    required
                    fullWidth
                    helperText={
                      form.author_input && !form.author_id && !authors.find(a => a.name.toLowerCase() === form.author_input.toLowerCase())
                        ? `✨ "${form.author_input}" will be added as a new author`
                        : "Type a new author name or select from existing authors"
                    }
                    sx={{
                      '& .MuiFormHelperText-root': {
                        color: form.author_input && !form.author_id && !authors.find(a => a.name.toLowerCase() === form.author_input.toLowerCase())
                          ? '#6a4c93' : undefined,
                        fontWeight: form.author_input && !form.author_id && !authors.find(a => a.name.toLowerCase() === form.author_input.toLowerCase())
                          ? 'bold' : undefined
                      }
                    }}
                  />
                )}
              />
              <TextField
                name="description"
                label="Description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                helperText="Brief description of the book"
              />
              <TextField
                name="publication_year"
                label="Publication Year"
                type="number"
                value={form.publication_year}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="isbn"
                label="ISBN"
                value={form.isbn}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="genre"
                label="Genre"
                value={form.genre}
                onChange={handleChange}
                fullWidth
                helperText="e.g. Fiction, Non-fiction, Science, History, etc."
              />
              <TextField
                name="pages"
                label="Number of Pages"
                type="number"
                value={form.pages}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                name="image_url"
                label="Image URL"
                value={form.image_url}
                onChange={handleChange}
                fullWidth
                helperText="Optional: URL to book cover image"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{ 
                background: 'linear-gradient(45deg, #6a4c93, #1b1464)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1b1464, #6a4c93)',
                }
              }}
            >
              {editingId ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Borrow Dialog */}
        <BorrowDialog
          open={borrowDialogOpen}
          onClose={() => setBorrowDialogOpen(false)}
          book={selectedBook}
          onBorrow={handleBorrowSuccess}
        />

        {/* Success/Error Snackbar */}
        <Snackbar
          open={!!success}
          autoHideDuration={4000}
          onClose={() => setSuccess('')}
          message={success}
        />
        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={() => setError('')}
          message={error}
        />
      </Box>
    </Box>
  );
}