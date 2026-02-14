from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/categories", tags=["Categories"])

# CREATE category
@router.post("/")
def create_category(cat: schemas.CategoryCreate, db: Session = Depends(get_db)):
    new_cat = models.Category(**cat.dict())
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

# LIST categories
@router.get("/")
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

# LIST books of a category
@router.get("/{category_id}/books")
def books_by_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(404, "Category not found")
    return category.books
