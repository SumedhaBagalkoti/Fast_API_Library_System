# Library Management System

A complete full-stack Library Management System built with **FastAPI**, **SQLite**, **SQLAlchemy**, **React**, **Vite**, and **Axios**. Includes CRUD operations, filtering, statistics, and a fully interactive UI.

## Features

### Backend – FastAPI
- CRUD for Books, Authors, and Categories
- Filtering by author, category, year, and limit
- Statistics endpoints (total books, average year, author range, book counts, and more)
- SQLite database via SQLAlchemy ORM

### Frontend – React (Vite)
- Modern, clean UI
- Pages for Authors, Books, and Categories
- Add / Edit / Delete via popup modals
- Book count per author
- Prevents deleting authors who have books
- Statistics displayed inside author detail view
- Axios API wrapper

## Project Structure

```
library_system/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── auth_middleware.py
│   ├── routers/
│   │   ├── books.py
│   │   ├── authors.py
│   │   ├── categories.py
│   │   └── stats.py
│   ├── requirements.txt
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── api/api.js
    │   ├── pages/
    │   ├── components/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Installation

### Backend (FastAPI)

**1. Create and activate a virtual environment**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

**2. Install dependencies**

```bash
pip install -r requirements.txt
```

**3. Start the backend**

```bash
uvicorn main:app --reload
```

| Resource | URL |
|---|---|
| Backend API | http://127.0.0.1:8000 |
| Swagger Docs | http://127.0.0.1:8000/docs |

### Frontend (React + Vite)

From inside the `frontend/` folder:

**1. Install dependencies**

```bash
npm install
```

**2. Start the dev server**

```bash
npm run dev
```

| Resource | URL |
|---|---|
| Frontend | http://127.0.0.1:5173 |

## API Endpoints

### Authors

| Method | Route | Description |
|---|---|---|
| `POST` | `/authors/` | Create author |
| `GET` | `/authors/` | List all authors |
| `GET` | `/authors/{id}/books` | Get books by author |
| `DELETE` | `/authors/{id}` | Delete author (blocked if books exist) |

### Categories

| Method | Route |
|---|---|
| `POST` | `/categories/` |
| `GET` | `/categories/` |
| `GET` | `/categories/{id}/books` |
| `DELETE` | `/categories/{id}` |

### Books

| Method | Route |
|---|---|
| `POST` | `/books/` |
| `GET` | `/books/` |
| `GET` | `/books/{id}` |
| `PUT` | `/books/{id}` |
| `DELETE` | `/books/{id}` |

**Filtering query params:**

/books?author_id=1
/books?category_id=1
/books?year=2001
/books?limit=5
```

## Statistics Endpoints

| Description | Route |
|---|---|
| Total books | `GET /stats/total-books` |
| Average publication year | `GET /stats/avg-year` |
| Earliest & latest book by author | `GET /stats/author-range/{id}` |
| First N books sorted by title | `GET /stats/first-n-books/{n}` |
| Does author have books? | `GET /stats/author-has-books/{id}` |
| Count per author & category | `GET /stats/counts` |


## Book Insights Endpoint

```
GET /books/insights
```

Returns top 5 authors and years with 2 or more books, along with cleaned and validated book data.

**Example response:**

```json
{
  "top_authors": [
    { "author": "George Orwell", "total_books": 4 }
  ],
  "busy_years": [
    { "year": 1949, "books": ["1984", "Animal Farm"] }
  ]
}
```

## Frontend Pages

**Authors**
- List all authors with book counts
- Edit / Delete with confirmation (delete blocked if author has books)
- Add author via popup modal

**Author Details**
- Sorted book list
- Earliest and latest book
- "Has at least one book?" indicator

**Books**
- List, filter, edit, and delete
- Add / edit via popup forms

## Running the Full App

```bash
# Terminal 1 — Backend
uvicorn main:app --reload

# Terminal 2 — Frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

## Testing Tools

- [Swagger UI](http://127.0.0.1:8000/docs) — built-in interactive API docs
- [Thunder Client](https://www.thunderclient.com/) — VS Code REST client
- [Postman](https://www.postman.com/) — standalone API testing