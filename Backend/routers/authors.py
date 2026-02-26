from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/authors", tags=["Authors"])

# CREATE author
@router.post("/")
def create_author(author: schemas.AuthorCreate, db: Session = Depends(get_db)):
    new_author = models.Author(**author.dict())
    db.add(new_author)
    db.commit()
    db.refresh(new_author)
    return new_author

@router.put("/{id}")
def update_author(id: int, author: schemas.AuthorCreate, db: Session = Depends(get_db)):
    db_author = db.query(models.Author).filter(models.Author.id == id).first()
    if not db_author:
        raise HTTPException(status_code=404, detail="Author not found")

    db_author.name = author.name
    db.commit()
    db.refresh(db_author)
    return db_author

# LIST authors
# @router.get("/")
# def list_authors(db: Session = Depends(get_db)):
#     return db.query(models.Author).all()


@router.get("/{author_id}")
def get_authors(author_id: int, db: Session = Depends(get_db)):
    author = db.query(models.Author).filter(models.Author.id == author_id).first()
    if not author:
        raise HTTPException(404, "Author not found")
    return author

@router.get("/")
def list_authors(db: Session = Depends(get_db)):
    authors = db.query(models.Author).all()

    result = []
    for a in authors:
        result.append({
            "id": a.id,
            "name": a.name,
            "book_count": len(a.books)  # <-- FIXED HERE
        })

    return result

# LIST books of an author
@router.get("/{author_id}/books")
def books_by_author(author_id: int, db: Session = Depends(get_db)):
    author = db.query(models.Author).filter(models.Author.id == author_id).first()
    if not author:
        raise HTTPException(404, "Author not found")
    return author.books

# DELETE author
@router.delete("/{author_id}")
def delete_author(author_id: int, db: Session = Depends(get_db)):
    author = db.query(models.Author).filter(models.Author.id == author_id).first()
    if not author:
        raise HTTPException(404, "Author not found")

    db.delete(author)
    db.commit()
    return {"message": "Author deleted"}
