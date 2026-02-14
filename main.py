from fastapi import FastAPI
from database import Base, engine
import models

from routers import books, authors, categories

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(books.router)
app.include_router(authors.router)
app.include_router(categories.router)

@app.get("/")
def root():
    return {"msg": "Library API running"}

