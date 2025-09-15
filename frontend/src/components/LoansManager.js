import React, { useEffect, useState } from 'react';
import { getActiveLoans, returnBook } from '../api/api';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Chip, Alert, Snackbar, Card, CardContent, Grid, Avatar
} from '@mui/material';
import { Assignment, AssignmentReturn, Person, Email, Phone } from '@mui/icons-material';

export default function LoansManager() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchLoans = async () => {
    try {
      const res = await getActiveLoans();
      setLoans(res.data);
    } catch (err) {
      setError('Failed to fetch loans');
    }
  };

  useEffect(() => { fetchLoans(); }, []);

  const handleReturn = async (loanId) => {
    if (window.confirm('Are you sure you want to return this book?')) {
      try {
        await returnBook(loanId);
        setSuccess('Book returned successfully!');
        fetchLoans();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to return book');
      }
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      p: 3,
      borderRadius: 2
    }}>
      <Paper sx={{ p: 3, background: 'rgba(255,255,255,0.95)' }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Assignment sx={{ mr: 2, color: '#667eea', fontSize: 40 }} />
          <Typography variant="h4" sx={{ 
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 'bold'
          }}>
            Active Loans
          </Typography>
        </Box>

        {loans.length === 0 ? (
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}>
            <Typography variant="h6" color="text.secondary">
              📚 No active loans found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              All books are currently available in the library
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {loans.map(loan => {
              const daysRemaining = getDaysRemaining(loan.due_date);
              const overdue = isOverdue(loan.due_date);
              
              return (
                <Grid item xs={12} md={6} lg={4} key={loan.id}>
                  <Card sx={{ 
                    height: '100%',
                    background: overdue 
                      ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
                      : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        📖 {loan.book_title}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label={overdue ? `Overdue (${Math.abs(daysRemaining)} days)` : `${daysRemaining} days left`}
                          color={overdue ? 'error' : daysRemaining <= 3 ? 'warning' : 'success'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>

                      <Box sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        background: 'rgba(255,255,255,0.8)',
                        mb: 2 
                      }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Avatar sx={{ 
                            bgcolor: '#667eea', 
                            width: 32, 
                            height: 32, 
                            mr: 1 
                          }}>
                            <Person />
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {loan.borrower_name}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary">
                          <strong>Loan Date:</strong> {new Date(loan.loan_date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Due Date:</strong> {new Date(loan.due_date).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<AssignmentReturn />}
                        onClick={() => handleReturn(loan.id)}
                        sx={{ 
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #764ba2, #667eea)',
                          }
                        }}
                      >
                        Return Book
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

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
      </Paper>
    </Box>
  );
}