# Library Management System Schema

## Tables

### Author
- id (PK)
- name

### Book
- id (PK)
- title
- author_id (FK → Author.id)
- published_year
- isbn

### Borrower
- id (PK)
- name
- email

### Loan
- id (PK)
- book_id (FK → Book.id)
- borrower_id (FK → Borrower.id)
- loan_date
- return_date

## Relationships
- Book → Author: Many-to-One
- Loan → Book: Many-to-One
- Loan → Borrower: Many-to-One

This schema supports basic library operations: managing books, authors, borrowers, and tracking loans.