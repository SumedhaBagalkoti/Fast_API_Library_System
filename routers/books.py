from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/books", tags=["Books"])

# LIST books with filters
@router.get("/")
def list_books(
    author_id: int = None,
    category_id: int = None,
    year: int = None,
    limit: int = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Book)

    if author_id:
        query = query.filter(models.Book.author_id == author_id)
    if category_id:
        query = query.filter(models.Book.category_id == category_id)
    if year:
        query = query.filter(models.Book.year == year)
    if limit:
        query = query.limit(limit)

    return query.all()

# GET one book
@router.get("/{book_id}")
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(404, "Book not found")
    return book

# CREATE book
@router.post("/")
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    db_book = models.Book(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

# UPDATE book
@router.put("/{book_id}")
def update_book(book_id: int, book: schemas.BookCreate, db: Session = Depends(get_db)):
    db_book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not db_book:
        raise HTTPException(404, "Book not found")

    for key, value in book.dict().items():
        setattr(db_book, key, value)

    db.commit()
    return db_book

# DELETE book
@router.delete("/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(404, "Book not found")

    db.delete(book)
    db.commit()
    return {"message": "Book deleted"}
