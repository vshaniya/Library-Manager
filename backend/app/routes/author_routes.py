from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.models import Author

author_bp = Blueprint('authors', __name__)

@author_bp.route('', methods=['GET'])
@author_bp.route('/', methods=['GET'])
def get_authors():
    """Get all authors"""
    authors = Author.query.all()
    return jsonify([author.to_dict() for author in authors])

@author_bp.route('/<int:id>', methods=['GET'])
def get_author(id):
    """Get a specific author by ID"""
    author = Author.query.get_or_404(id)
    return jsonify(author.to_dict())

@author_bp.route('', methods=['POST'])
@author_bp.route('/', methods=['POST'])
def create_author():
    """Create a new author"""
    try:
        data = request.json
        new_author = Author(name=data['name'])
        db.session.add(new_author)
        db.session.commit()
        return jsonify(new_author.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@author_bp.route('/<int:id>', methods=['PUT'])
def update_author(id):
    """Update an existing author"""
    try:
        author = Author.query.get_or_404(id)
        data = request.json
        author.name = data.get('name', author.name)
        db.session.commit()
        return jsonify(author.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@author_bp.route('/<int:id>', methods=['DELETE'])
def delete_author(id):
    """Delete an author"""
    try:
        author = Author.query.get_or_404(id)
        db.session.delete(author)
        db.session.commit()
        return '', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400