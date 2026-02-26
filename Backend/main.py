from fastapi import FastAPI
from database import Base, engine
import models

#from auth_middleware import auth_middleware
from routers import books, authors, categories ,stats

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#app.middleware("http")(auth_middleware)

# Create tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(books.router)
app.include_router(authors.router)
app.include_router(categories.router)
app.include_router(stats.router)


@app.get("/")
def root():
    return {"msg": "Library API running"}

