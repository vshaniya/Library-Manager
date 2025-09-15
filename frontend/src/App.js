import React, { useState } from 'react';
import BookManagerNew from './components/BookManagerNew';
import LoansManager from './components/LoansManager';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Container, Tabs, Tab, Box } from '@mui/material';
import { LibraryBooks, Assignment } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Library Management System
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<LibraryBooks />} label="Books" />
            <Tab icon={<Assignment />} label="Active Loans" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <BookManagerNew />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <LoansManager />
        </TabPanel>
      </Container>
    </ThemeProvider>
  );
}

export default App;
