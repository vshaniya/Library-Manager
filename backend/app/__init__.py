from flask import Flask
from .extensions import db, cors

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    # Initialize extensions
    db.init_app(app)
    cors.init_app(app, origins=['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'])

    # Register blueprints
    from .routes.book_routes import book_bp
    from .routes.author_routes import author_bp
    from .routes.borrower_routes import borrower_bp
    from .routes.loan_routes import loan_bp
    
    app.register_blueprint(book_bp, url_prefix='/api/books')
    app.register_blueprint(author_bp, url_prefix='/api/authors')
    app.register_blueprint(borrower_bp, url_prefix='/api/borrowers')
    app.register_blueprint(loan_bp, url_prefix='/api/loans')

    return app
