# Library API - FastAPI Project

A complete Library API built using FastAPI, SQLite, SQLAlchemy, and Pydantic, featuring CRUD operations, filtering, authentication middleware, and statistical endpoints.

This project satisfies all requirements from the assignment, including database design, CRUD APIs, business logic checks, and authentication.

## 🚀 Features

✅ **CRUD Operations**
- Manage Books
- Manage Authors
- Manage Categories

✅ **Filtering Options**
- Filter books by author
- Filter books by category
- Filter books by year
- Limit number of books returned

✅ **Statistics Endpoints**
- Total books
- Average publication year
- Earliest & latest book of an author
- First N books sorted by title
- Category checks
- Count books per author/category
- List authors + sorted books

✅ **Authentication Middleware**
- Basic Auth implemented using middleware
- All routes require authentication
- Unauthorized users get 401

## 📁 Folder Structure
```
library_app/
│── main.py
│── database.py
│── models.py
│── schemas.py
│── auth_middleware.py
│── requirements.txt
│── routers/
│     ├── books.py
│     ├── authors.py
│     ├── categories.py
│     └── stats.py
│── README.md
```

## 🛠️ Requirements

Install the required Python packages:

- fastapi
- uvicorn
- sqlalchemy
- pydantic

You can install all dependencies using:
```bash
pip install -r requirements.txt
```

## ⚙️ How to Run the Project

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Create Virtual Environment (Optional but recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the FastAPI App
```bash
uvicorn main:app --reload
```

### 5. Open API Documentation

FastAPI provides automatic Swagger UI:

👉 http://127.0.0.1:8000/docs

## 🔐 Authentication (Required for All Endpoints)

This project implements Basic Authentication using middleware.

In every API request (Thunder Client / Postman):

**Use:**
- Username: `admin`
- Password: `password123`

If credentials are missing or wrong, response will be:
```json
{
  "detail": "Unauthorized"
}
```

## 📚 API Endpoints

Below are all URLs grouped by task for easy testing.

### 🧑‍🎨 TASK 1 & 2 — CRUD + Filtering Endpoints

#### 📌 AUTHORS

**➤ Create Author (POST)**
```
POST /authors/
```

Body:
```json
{
  "name": "J.K. Rowling",
  "info": "British author"
}
```

**➤ Get All Authors (GET)**
```
GET /authors/
```

**➤ Get Author's Books (GET)**
```
GET /authors/1/books
```

**➤ Delete Author (DELETE)**
```
DELETE /authors/1
```

#### 🏷 CATEGORIES

**➤ Create Category**
```
POST /categories/
```

Body:
```json
{ "name": "Fiction" }
```

**➤ Get All Categories**
```
GET /categories/
```

**➤ Get Category Books**
```
GET /categories/1/books
```

**➤ Delete Category**
```
DELETE /categories/1
```

#### 📚 BOOKS

**➤ Create Book**
```
POST /books/
```

Body:
```json
{
  "title": "Harry Potter",
  "isbn": "12345",
  "year": 1997,
  "author_id": 1,
  "category_id": 1
}
```

**➤ Get All Books**
```
GET /books/
```

**➤ Get Book by ID**
```
GET /books/1
```

**➤ Update Book**
```
PUT /books/1
```

**➤ Delete Book**
```
DELETE /books/1
```

#### 🔍 BOOK FILTERING

**➤ Books by author**
```
GET /books?author_id=1
```

**➤ Books by category**
```
GET /books?category_id=1
```

**➤ Books by year**
```
GET /books?year=1997
```

**➤ Limit N books**
```
GET /books?limit=2
```

### 📊 TASK 3 — Statistics & Business Checks

**✔ 1. Total Books**
```
GET /stats/total-books
```

**✔ 2. Average Publication Year**
```
GET /stats/avg-year
```

**✔ 3. Earliest + Latest book of an author**
```
GET /stats/author-range/1
```

**✔ 4. First N books sorted by title**
```
GET /stats/first-n-books/3
```

**✔ 6. Does author have any books?**
```
GET /stats/author-has-books/1
```

**✔ 7. Count books per author & category**
```
GET /stats/counts
```

### 🔐 TASK 4 — Authentication Middleware

- Middleware protects all routes.
- Authorization header required: `Authorization: Basic <base64>`
- Username: `admin`
- Password: `password123`
- All unauthorized requests return 401

## 🧪 Testing Tools

You can test using:

✔ Thunder Client (VS Code)  
✔ Swagger UI  
✔ Postman
