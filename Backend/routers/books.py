from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/books", tags=["Books"])

# LIST books with filters
# @router.get("/")
# def list_books(
#     author_id: int = None,
#     category_id: int = None,
#     year: int = None,
#     limit: int = None,
#     db: Session = Depends(get_db)
# ):
#     query = db.query(models.Book)

#     if author_id:
#         query = query.filter(models.Book.author_id == author_id)
#     if category_id:
#         query = query.filter(models.Book.category_id == category_id)
#     if year:
#         query = query.filter(models.Book.year == year)
#     if limit:
#         query = query.limit(limit)

#     return query.all()

# @router.get("/")
# def get_books(db: Session = Depends(get_db)):
#     books = db.query(models.Book).all()

#     result = []
#     for b in books:
#         result.append({
#             "id": b.id,
#             "title": b.title,
#             "isbn": b.isbn,
#             "year": b.year,
#             # "authors": [{"id": b.author.id, "name": b.author.name}] if b.author else [],
#             # "categories": [
#             #     {"id": b.category.id, "name": b.category.name}] if b.category else []
#             "authors": b.author.name if b.author else [],
#             "categories": b.category.name if b.category else []
#         })

#     return result

@router.get("/")
def get_books(
    author_id: int = None,
    category_id: int = None,
    year: int = None,
    limit: int = None,
    db: Session = Depends(get_db)
):

    query = db.query(models.Book)

    # Filters
    if author_id:
        query = query.filter(models.Book.author_id == author_id)

    if category_id:
        query = query.filter(models.Book.category_id == category_id)

    if year:
        query = query.filter(models.Book.year == year)

    if limit:
        query = query.limit(limit)

    books = query.all()

    # Final response formatting
    result = []
    for b in books:
        result.append({
            "id": b.id,
            "title": b.title,
            "isbn": b.isbn,
            "year": b.year,
            "authors": b.author.name if b.author else None,
            "categories": b.category.name if b.category else None
        })

    return result


@router.get("/insights")
def books_insights(db: Session = Depends(get_db)):

    # 1. LOAD ALL BOOKS
    all_books = db.query(models.Book).all()

    if not all_books:
        return {
            "top_authors": [],
            "busy_years": []
        }

    # 2. FILTER VALID BOOKS
    valid_books = [
        b for b in all_books
        if b.author is not None
        and b.year is not None
        and 1900 <= b.year <= 2100
    ]

    # If no valid books:
    if not valid_books:
        return {
            "top_authors": [],
            "busy_years": []
        }

    # 3. TOP 5 AUTHORS BY BOOK COUNT
    author_count = {}
    for book in valid_books:
        name = book.author.name
        author_count[name] = author_count.get(name, 0) + 1

    # Sort authors by count DESC and take top 5
    top_authors = sorted(
        author_count.items(),
        key=lambda x: x[1],
        reverse=True
    )[:5]

    top_authors_output = [
        {"author": name, "total_books": count}
        for name, count in top_authors
    ]

    # 4. BUSY YEARS (years with at least 2 books)
    year_map = {}
    for book in valid_books:
        year = book.year
        year_map.setdefault(year, []).append(book.title)

    busy_years = [
        {"year": year, "books": titles}
        for year, titles in year_map.items()
        if len(titles) >= 2
    ]

    # Sort years ASC
    busy_years = sorted(busy_years, key=lambda x: x["year"])

    # 5. RETURN FINAL REPORT
    return {
        "top_authors": top_authors_output,
        "busy_years": busy_years
    }

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

