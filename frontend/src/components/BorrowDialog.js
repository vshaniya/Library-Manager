import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, MenuItem, Alert
} from '@mui/material';
import { createBorrower, createLoan } from '../api/api';

const BorrowDialog = ({ open, onClose, book, onBorrow }) => {
  const [step, setStep] = useState(1); // 1: Borrower details, 2: Loan details
  const [borrowerData, setBorrowerData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loanData, setLoanData] = useState({
    days_to_return: 14
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBorrowerChange = (e) => {
    setBorrowerData({ ...borrowerData, [e.target.name]: e.target.value });
  };

  const handleLoanChange = (e) => {
    setLoanData({ ...loanData, [e.target.name]: parseInt(e.target.value) });
  };

  const handleNextStep = async () => {
    if (!borrowerData.name || !borrowerData.email) {
      setError('Name and email are required');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleBorrow = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Create borrower first
      const borrowerResponse = await createBorrower(borrowerData);
      const borrowerId = borrowerResponse.data.id;
      
      // Create loan
      await createLoan({
        book_id: book.id,
        borrower_id: borrowerId,
        days_to_return: loanData.days_to_return
      });
      
      onBorrow();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to borrow book');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setBorrowerData({ name: '', email: '', phone: '' });
    setLoanData({ days_to_return: 14 });
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        background: 'linear-gradient(45deg, #6a4c93, #1b1464)',
        color: 'white'
      }}>
        📖 Borrow: {book?.title}
      </DialogTitle>
      <DialogContent sx={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {step === 1 && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              name="name"
              label="👤 Borrower Name"
              value={borrowerData.name}
              onChange={handleBorrowerChange}
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.8)'
                }
              }}
            />
            <TextField
              name="email"
              label="📧 Email"
              type="email"
              value={borrowerData.email}
              onChange={handleBorrowerChange}
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.8)'
                }
              }}
            />
            <TextField
              name="phone"
              label="📱 Phone Number"
              value={borrowerData.phone}
              onChange={handleBorrowerChange}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.8)'
                }
              }}
            />
          </Stack>
        )}

        {step === 2 && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              name="days_to_return"
              label="📅 Days to Return"
              select
              value={loanData.days_to_return}
              onChange={handleLoanChange}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.8)'
                }
              }}
            >
              <MenuItem value={7}>7 days</MenuItem>
              <MenuItem value={14}>14 days</MenuItem>
              <MenuItem value={21}>21 days</MenuItem>
              <MenuItem value={30}>30 days</MenuItem>
            </TextField>
            <div style={{ 
              padding: '16px', 
              borderRadius: '8px', 
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              marginTop: '16px'
            }}>
              <p><strong>👤 Borrower:</strong> {borrowerData.name}</p>
              <p><strong>📚 Book:</strong> {book?.title}</p>
              <p><strong>📧 Email:</strong> {borrowerData.email}</p>
              {borrowerData.phone && <p><strong>📱 Phone:</strong> {borrowerData.phone}</p>}
            </div>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <Button onClick={handleClose}>Cancel</Button>
        {step === 1 && (
          <Button 
            onClick={handleNextStep} 
            variant="contained"
            sx={{ 
              background: 'linear-gradient(45deg, #6a4c93, #1b1464)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1b1464, #6a4c93)',
              }
            }}
          >
            Next
          </Button>
        )}
        {step === 2 && (
          <>
            <Button onClick={() => setStep(1)}>Back</Button>
            <Button 
              onClick={handleBorrow} 
              variant="contained" 
              disabled={loading}
              sx={{ 
                background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #feca57, #ff6b6b)',
                },
                '&:disabled': {
                  background: 'rgba(0,0,0,0.1)',
                  color: 'rgba(0,0,0,0.3)'
                }
              }}
            >
              {loading ? 'Borrowing...' : '📖 Borrow Book'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BorrowDialog;