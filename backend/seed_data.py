from app import create_app
from app.extensions import db
from app.models.models import Author, Book, Borrower

app = create_app()

def seed_data():
    """Add sample data to the database"""
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create sample authors
        authors = [
            Author(name="J.K. Rowling"),
            Author(name="George Orwell"),
            Author(name="Harper Lee"),
            Author(name="F. Scott Fitzgerald"),
            Author(name="Jane Austen"),
            Author(name="Stephen King"),
            Author(name="Agatha Christie")
        ]
        
        for author in authors:
            db.session.add(author)
        
        db.session.commit()
        
        # Create sample books with images
        books = [
            Book(title="Harry Potter and the Philosopher's Stone", author_id=1, published_year=1997, isbn="9780747532699", 
                 image_url="https://images-na.ssl-images-amazon.com/images/I/91ocU8970hL.jpg"),
            Book(title="1984", author_id=2, published_year=1949, isbn="9780451524935",
                 image_url="https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg"),
            Book(title="To Kill a Mockingbird", author_id=3, published_year=1960, isbn="9780446310789",
                 image_url="https://images-na.ssl-images-amazon.com/images/I/81aY1lxk+9L.jpg"),
            Book(title="The Great Gatsby", author_id=4, published_year=1925, isbn="9780743273565",
                 image_url="https://images-na.ssl-images-amazon.com/images/I/81af+MCATTL.jpg"),
            Book(title="Pride and Prejudice", author_id=5, published_year=1813, isbn="9780141439518",
                 image_url="https://images-na.ssl-images-amazon.com/images/I/81NLDvyAHrL.jpg"),
            Book(title="The Shining", author_id=6, published_year=1977, isbn="9780307743657",
                 image_url="https://images-na.ssl-images-amazon.com/images/I/91kKWG5cjTL.jpg"),
            Book(title="Murder on the Orient Express", author_id=7, published_year=1934, isbn="9780062693662",
                 image_url="https://images-na.ssl-images-amazon.com/images/I/81lJEKKMKLL.jpg"),
            Book(title="Harry Potter and the Chamber of Secrets", author_id=1, published_year=1998, isbn="9780747538493",
                 image_url="https://images-na.ssl-images-amazon.com/images/I/91OmBTrpMsL.jpg")
        ]
        
        for book in books:
            db.session.add(book)
        
        # Create sample borrowers
        borrowers = [
            Borrower(name="John Smith", email="john.smith@email.com", phone="123-456-7890"),
            Borrower(name="Sarah Johnson", email="sarah.j@email.com", phone="098-765-4321"),
            Borrower(name="Mike Brown", email="mike.brown@email.com", phone="555-123-4567"),
            Borrower(name="Emily Davis", email="emily.davis@email.com", phone="444-987-6543")
        ]
        
        for borrower in borrowers:
            db.session.add(borrower)
        
        db.session.commit()
        
        print("Sample data added successfully!")
        print(f"Added {len(authors)} authors, {len(books)} books, and {len(borrowers)} borrowers")

if __name__ == '__main__':
    seed_data()