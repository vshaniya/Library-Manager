from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.models import Book, Author

book_bp = Blueprint('books', __name__)

@book_bp.route('', methods=['GET'])
@book_bp.route('/', methods=['GET'])
def get_books():
    """Get all books"""
    books = Book.query.all()
    return jsonify([book.to_dict() for book in books])

@book_bp.route('/<int:id>', methods=['GET'])
def get_book(id):
    """Get a specific book by ID"""
    book = Book.query.get_or_404(id)
    return jsonify(book.to_dict())

@book_bp.route('', methods=['POST'])
@book_bp.route('/', methods=['POST'])
def create_book():
    """Create a new book"""
    try:
        data = request.json
        
        # Validate required fields
        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400
        if not data.get('author_id'):
            return jsonify({'error': 'Author ID is required'}), 400
            
        # Check if author exists
        author = Author.query.get(data['author_id'])
        if not author:
            return jsonify({'error': f'Author with ID {data["author_id"]} does not exist'}), 400
            
        # Check if ISBN already exists (if provided)
        if data.get('isbn'):
            existing_book = Book.query.filter_by(isbn=data['isbn']).first()
            if existing_book:
                return jsonify({'error': f'Book with ISBN {data["isbn"]} already exists'}), 400
        
        new_book = Book(
            title=data['title'],
            author_id=data['author_id'],
            publication_year=data.get('publication_year'),
            isbn=data.get('isbn'),
            description=data.get('description'),
            genre=data.get('genre'),
            pages=data.get('pages'),
            image_url=data.get('image_url', 'https://via.placeholder.com/150x200?text=No+Image')
        )
        db.session.add(new_book)
        db.session.commit()
        return jsonify(new_book.to_dict()), 201
        
    except KeyError as e:
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@book_bp.route('/<int:id>', methods=['PUT'])
def update_book(id):
    """Update an existing book"""
    try:
        book = Book.query.get_or_404(id)
        data = request.json
        
        # Check if author exists (if author_id is being updated)
        if 'author_id' in data and data['author_id'] != book.author_id:
            author = Author.query.get(data['author_id'])
            if not author:
                return jsonify({'error': f'Author with ID {data["author_id"]} does not exist'}), 400
        
        # Check if ISBN already exists (if being updated)
        if 'isbn' in data and data['isbn'] != book.isbn:
            existing_book = Book.query.filter_by(isbn=data['isbn']).first()
            if existing_book:
                return jsonify({'error': f'Book with ISBN {data["isbn"]} already exists'}), 400
        
        book.title = data.get('title', book.title)
        book.author_id = data.get('author_id', book.author_id)
        book.publication_year = data.get('publication_year', book.publication_year)
        book.isbn = data.get('isbn', book.isbn)
        book.description = data.get('description', book.description)
        book.genre = data.get('genre', book.genre)
        book.pages = data.get('pages', book.pages)
        book.image_url = data.get('image_url', book.image_url)
        
        db.session.commit()
        return jsonify(book.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@book_bp.route('/<int:id>', methods=['DELETE'])
def delete_book(id):
    """Delete a book"""
    try:
        book = Book.query.get_or_404(id)
        force_delete = request.args.get('force') == 'true'
        
        if book.loans:
            active_loans = [loan for loan in book.loans if loan.status == 'active']
            if active_loans:
                return jsonify({'error': 'Cannot delete book with active loans. Please return the book first.'}), 400
            elif not force_delete:
                return jsonify({
                    'error': 'Cannot delete book with loan history. This book has been borrowed before.',
                    'suggestion': 'Add ?force=true to URL to force delete and remove loan history.'
                }), 400
            else:
                # Force delete: remove all loan records first
                for loan in book.loans:
                    db.session.delete(loan)
            
        db.session.delete(book)
        db.session.commit()
        return '', 204
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
