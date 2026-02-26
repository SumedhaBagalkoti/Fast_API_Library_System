from pydantic import BaseModel
from typing import Optional

class AuthorBase(BaseModel):
    name: str
    info: Optional[str] = None

class AuthorCreate(AuthorBase):
    pass

class AuthorRead(AuthorBase):
    id: int
    class Config:
        orm_mode = True


class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryRead(CategoryBase):
    id: int
    class Config:
        orm_mode = True


class BookBase(BaseModel):
    title: str
    isbn: str
    year: int
    author_id: int
    category_id: int

class BookCreate(BookBase):
    pass

class BookRead(BookBase):
    id: int
    class Config:
        orm_mode = True
