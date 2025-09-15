# 📚 Library Management System

A full-stack web application for managing library operations with modern UI and robust backend architecture.

## 🎯 Key Features

### ✅ **Complete CRUD Operations**
- **Books Management**: Add, edit, delete, and view books with detailed information
- **Authors Management**: Manage author profiles and relationships
- **Borrower Management**: Register and manage library members
- **Loan System**: Complete borrow/return workflow with due date tracking

### ✅ **Professional UI Design**
- **Amazon-style Cards**: Modern card-based layout for book display
- **Material-UI Components**: Professional, responsive design
- **Book-themed Gradients**: Beautiful purple/blue gradient themes
- **Interactive Elements**: Hover effects, loading states, success notifications

### ✅ **Robust Backend Architecture**
- **RESTful API Design**: Clean, standardized endpoints
- **PostgreSQL Integration**: Production-ready relational database
- **Error Handling**: Comprehensive validation and error responses
- **Modular Structure**: Blueprint-based Flask organization

## 🛠 Tech Stack

- **Frontend**: React 18, Material-UI, Axios
- **Backend**: Flask, SQLAlchemy, Flask-CORS
- **Database**: PostgreSQL (production) / SQLite (development)
- **API**: RESTful with JSON responses

## 📁 Project Structure

```
library/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Flask app factory
│   │   ├── config.py            # Configuration settings
│   │   ├── extensions.py        # Database and CORS setup
│   │   ├── models/
│   │   │   └── models.py        # SQLAlchemy models
│   │   └── routes/
│   │       ├── book_routes.py   # Book CRUD endpoints
│   │       ├── author_routes.py # Author CRUD endpoints
│   │       ├── borrower_routes.py # Borrower management
│   │       └── loan_routes.py   # Loan management
│   ├── run.py                   # Application entry point
│   ├── .env                     # Environment variables
│   └── requirements.txt         # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── BookManagerNew.js # Main book interface
    │   │   ├── BorrowDialog.js   # Borrowing workflow
    │   │   └── LoansManager.js   # Active loans display
    │   ├── api/
    │   │   └── api.js            # API integration layer
    │   └── App.js                # Main React component
    ├── package.json              # Node.js dependencies
    └── public/
```

## 🗄️ Database Schema

### Relational Design
```sql
Authors (1) ──→ (N) Books ──→ (N) Loans ←── (1) Borrowers
```

### Tables:
- **authors**: `id, name, biography, birth_date`
- **books**: `id, title, author_id, description, genre, isbn, pages, image_url, available`
- **borrowers**: `id, name, email, phone`
- **loans**: `id, book_id, borrower_id, loan_date, due_date, return_date, status`

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16+
- Python 3.8+
- PostgreSQL 12+

### 1. Database Setup
```sql
-- Connect to PostgreSQL
psql -U postgres -h localhost -p 5433

-- Create database and tables (use provided schema)
CREATE DATABASE library_db;
\c library_db;
-- Run the schema from our previous conversation
```

### 2. Backend Setup
```bash
cd backend
pip install flask flask-sqlalchemy flask-cors psycopg2-binary python-dotenv
python run.py  # Starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start  # Starts on http://localhost:3000
```

## 🔧 Configuration

### Environment Variables (.env)
```env
DATABASE_URL=postgresql://postgres:ShaniyaV%4010@localhost:5433/library_db
SECRET_KEY=your-secret-key-here
```

## 📋 API Endpoints

### Books
- `GET /api/books` - List all books
- `POST /api/books` - Create new book
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book

### Authors
- `GET /api/authors` - List all authors
- `POST /api/authors` - Create new author

### Borrowers
- `GET /api/borrowers` - List all borrowers
- `POST /api/borrowers` - Register new borrower

### Loans
- `GET /api/loans/active` - List active loans
- `POST /api/loans` - Create new loan (borrow book)
- `PUT /api/loans/{id}/return` - Return book

## 🎨 UI Features

### Book Cards
- **Visual Design**: Book cover images, gradient backgrounds
- **Information Display**: Title, author, genre, availability status
- **Action Buttons**: Edit, Delete, Borrow (if available)

### Borrow Workflow
- **Step 1**: Borrower registration (name, email, phone)
- **Step 2**: Loan terms selection (return period)
- **Confirmation**: Summary before finalizing

### Active Loans
- **Card Layout**: Beautiful gradient cards for each loan
- **Borrower Details**: Name, contact information
- **Status Tracking**: Days remaining, overdue alerts
- **Return Action**: One-click book return

## 🔍 Code Quality Features

### Backend
- **Blueprint Organization**: Modular route structure
- **Error Handling**: Comprehensive try-catch blocks
- **Validation**: Input validation and data integrity
- **Database Relationships**: Proper foreign key constraints

### Frontend
- **Component Architecture**: Reusable React components
- **State Management**: Proper useState and useEffect usage
- **API Integration**: Centralized axios configuration
- **User Experience**: Loading states, success/error notifications

## 🚦 Running the Application

1. **Start PostgreSQL** and ensure database is created
2. **Run Backend**: `cd backend && python run.py`
3. **Run Frontend**: `cd frontend && npm start`
4. **Access Application**: http://localhost:3000

## 📊 System Workflow

```
User Action → React Component → API Call → Flask Route → SQLAlchemy → PostgreSQL
     ↓
PostgreSQL → SQLAlchemy → Flask Response → API Response → React State → UI Update
```

## ✨ Key Achievements

- ✅ **Clean Architecture**: Separation of concerns, modular design
- ✅ **Production Database**: PostgreSQL with proper relationships
- ✅ **Professional UI**: Material-UI with custom gradients
- ✅ **Complete Workflow**: End-to-end book borrowing system
- ✅ **Error Handling**: Robust validation and user feedback
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Real-time Updates**: Immediate UI updates after actions

---

## 📝 Developer Notes

This system demonstrates:
- **Full-stack development** with modern technologies
- **Database design** with proper normalization
- **API design** following RESTful principles
- **UI/UX design** with focus on user experience
- **Code organization** for maintainability and scalability
