from app.extensions import ma
from app.models.models import Author, Book, Borrower, Loan

class AuthorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Author
        load_instance = True

class BookSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Book
        load_instance = True

class BorrowerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Borrower
        load_instance = True

class LoanSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Loan
        load_instance = True
