from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.models import Loan, Book, Borrower
from datetime import datetime, timedelta

loan_bp = Blueprint('loans', __name__)

@loan_bp.route('', methods=['GET'])
@loan_bp.route('/', methods=['GET'])
def get_loans():
    """Get all loans"""
    loans = Loan.query.all()
    return jsonify([loan.to_dict() for loan in loans])

@loan_bp.route('/active', methods=['GET'])
def get_active_loans():
    """Get all active (not returned) loans"""
    active_loans = Loan.query.filter_by(status='active').all()
    return jsonify([loan.to_dict() for loan in active_loans])

@loan_bp.route('', methods=['POST'])
@loan_bp.route('/', methods=['POST'])
def create_loan():
    """Create a new loan (borrow a book)"""
    try:
        data = request.json
        book_id = data['book_id']
        borrower_id = data['borrower_id']
        days_to_return = data.get('days_to_return', 14)  # Default 2 weeks
        
        # Check if book exists and is available
        book = Book.query.get_or_404(book_id)
        if not book.available:
            return jsonify({'error': 'Book is not available for loan'}), 400
            
        # Check if borrower exists
        borrower = Borrower.query.get_or_404(borrower_id)
        
        # Create loan
        due_date = datetime.utcnow().date() + timedelta(days=days_to_return)
        new_loan = Loan(
            book_id=book_id,
            borrower_id=borrower_id,
            due_date=due_date
        )
        
        # Mark book as unavailable
        book.available = False
        
        db.session.add(new_loan)
        db.session.commit()
        return jsonify(new_loan.to_dict()), 201
        
    except KeyError as e:
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@loan_bp.route('/<int:id>/return', methods=['PUT'])
def return_book(id):
    """Return a borrowed book"""
    try:
        loan = Loan.query.get_or_404(id)
        
        if loan.status == 'returned':
            return jsonify({'error': 'Book already returned'}), 400
            
        # Mark loan as returned
        loan.status = 'returned'
        loan.return_date = datetime.utcnow().date()
        
        # Mark book as available
        book = Book.query.get(loan.book_id)
        if book:
            book.available = True
            
        db.session.commit()
        return jsonify(loan.to_dict())
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@loan_bp.route('/<int:id>', methods=['DELETE'])
def delete_loan(id):
    """Delete a loan record"""
    try:
        loan = Loan.query.get_or_404(id)
        
        # If loan is not returned, make book available again
        if loan.status == 'active':
            book = Book.query.get(loan.book_id)
            if book:
                book.available = True
                
        db.session.delete(loan)
        db.session.commit()
        return '', 204
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400