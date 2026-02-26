from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter(prefix="/stats", tags=["Statistics"])


# 1. TOTAL BOOKS
@router.get("/total-books")
def total_books(db: Session = Depends(get_db)):
    count = db.query(models.Book).count()
    return {"total_books": count}


# 2. AVERAGE PUBLICATION YEAR
@router.get("/avg-year")
def average_year(db: Session = Depends(get_db)):
    books = db.query(models.Book).all()
    if not books:
        return {"average_year": 0}
    
    years = [b.year for b in books if b.year is not None]
    avg = sum(years) / len(years)
    return {"average_year": avg}


# 3. EARLIEST + LATEST BOOK OF AN AUTHOR
@router.get("/author-range/{author_id}")
def author_year_range(author_id: int, db: Session = Depends(get_db)):
    books = db.query(models.Book).filter(models.Book.author_id == author_id).order_by(models.Book.year).all()
    
    if not books:
        raise HTTPException(404, "No books for this author")

    return {
        "author_id": author_id,
        "earliest_book": books[0].title,
        "latest_book": books[-1].title
    }


# 4. FIRST N BOOKS SORTED BY TITLE
@router.get("/first-n-books/{n}")
def first_n_books(n: int, db: Session = Depends(get_db)):
    books = db.query(models.Book).order_by(models.Book.title).limit(n).all()
    return books


# 6. CHECK IF AUTHOR HAS AT LEAST ONE BOOK
@router.get("/author-has-books/{author_id}")
def author_exists(author_id: int, db: Session = Depends(get_db)):
    exists = db.query(models.Book).filter(models.Book.author_id == author_id).first()
    return {"has_books": exists is not None}


# 7. COUNT BOOKS PER AUTHOR + CATEGORY
@router.get("/counts")
def count_books(db: Session = Depends(get_db)):
    
    authors = db.query(models.Author).all()
    categories = db.query(models.Category).all()

    author_counts = [
        {"author": a.name, "total_books": len(a.books)}
        for a in authors
    ]

    category_counts = [
        {"category": c.name, "total_books": len(c.books)}
        for c in categories
    ]

    return {
        "books_per_author": author_counts,
        "books_per_category": category_counts
    }

