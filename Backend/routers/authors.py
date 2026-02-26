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

# LIST authors
@router.get("/")
def list_authors(db: Session = Depends(get_db)):
    return db.query(models.Author).all()

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
