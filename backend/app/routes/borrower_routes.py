from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.models import Borrower

borrower_bp = Blueprint('borrowers', __name__)

@borrower_bp.route('', methods=['GET'])
@borrower_bp.route('/', methods=['GET'])
def get_borrowers():
    """Get all borrowers"""
    borrowers = Borrower.query.all()
    return jsonify([borrower.to_dict() for borrower in borrowers])

@borrower_bp.route('/<int:id>', methods=['GET'])
def get_borrower(id):
    """Get a specific borrower by ID"""
    borrower = Borrower.query.get_or_404(id)
    return jsonify(borrower.to_dict())

@borrower_bp.route('', methods=['POST'])
@borrower_bp.route('/', methods=['POST'])
def create_borrower():
    """Create a new borrower or return existing one by email"""
    try:
        data = request.json
        
        # Check if borrower already exists by email
        existing_borrower = Borrower.query.filter_by(email=data['email']).first()
        if existing_borrower:
            # Update existing borrower info if provided
            if 'name' in data:
                existing_borrower.name = data['name']
            if 'phone' in data:
                existing_borrower.phone = data.get('phone')
            db.session.commit()
            return jsonify(existing_borrower.to_dict()), 200
            
        # Create new borrower if email doesn't exist
        new_borrower = Borrower(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone')
        )
        db.session.add(new_borrower)
        db.session.commit()
        return jsonify(new_borrower.to_dict()), 201
    except KeyError as e:
        return jsonify({'error': f'Missing required field: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@borrower_bp.route('/<int:id>', methods=['PUT'])
def update_borrower(id):
    """Update an existing borrower"""
    try:
        borrower = Borrower.query.get_or_404(id)
        data = request.json
        
        # Check if email already exists (excluding current borrower)
        if 'email' in data and data['email'] != borrower.email:
            if Borrower.query.filter_by(email=data['email']).first():
                return jsonify({'error': 'Email already exists'}), 400
        
        borrower.name = data.get('name', borrower.name)
        borrower.email = data.get('email', borrower.email)
        borrower.phone = data.get('phone', borrower.phone)
        db.session.commit()
        return jsonify(borrower.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@borrower_bp.route('/<int:id>', methods=['DELETE'])
def delete_borrower(id):
    """Delete a borrower"""
    try:
        borrower = Borrower.query.get_or_404(id)
        # Check if borrower has active loans
        active_loans = [loan for loan in borrower.loans if not loan.returned]
        if active_loans:
            return jsonify({'error': 'Cannot delete borrower with active loans'}), 400
            
        db.session.delete(borrower)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400