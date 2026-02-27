import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api/api";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    author_id: "",
    category_id: "",
    year: "",
    year_from: "",
    year_to: "",
    limit: "",
    sortAZ: false,
  });

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    isbn: "",
    year: "",
    author_id: "",
    category_id: "",
  });

  const primaryColor = "#3575b9";

  const loadBooks = async () => {
    let query = [];
    if (filters.author_id) query.push(`author_id=${filters.author_id}`);
    if (filters.category_id) query.push(`category_id=${filters.category_id}`);
    if (filters.year) query.push(`year=${filters.year}`);
    if (filters.limit) query.push(`limit=${filters.limit}`);
    if (filters.year_from && filters.year_to) {
      query.push(`year_from=${filters.year_from}`);
      query.push(`year_to=${filters.year_to}`);
    }

    let url = "/books";
    if (query.length > 0) url += "?" + query.join("&");

    let data = await apiGet(url);
    if (filters.sortAZ) data = data.sort((a, b) => a.title.localeCompare(b.title));
    setBooks(data);
  };

  const loadAuthorsAndCategories = async () => {
    setAuthors(await apiGet("/authors"));
    setCategories(await apiGet("/categories"));
  };

  useEffect(() => {
    loadBooks();
    loadAuthorsAndCategories();
  }, []);

  useEffect(() => {
    loadBooks();
  }, [filters]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      isbn: formData.isbn,
      year: Number(formData.year),
      author_id: Number(formData.author_id),
      category_id: Number(formData.category_id),
    };
    if (formData.id) await apiPut(`/books/${formData.id}`, payload);
    else await apiPost("/books", payload);

    resetForm();
    loadBooks();
  };

  const resetForm = () => setFormData({ id: null, title: "", isbn: "", year: "", author_id: "", category_id: "" });
  const handleEdit = (b) => setFormData({ ...b });
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try { await apiDelete(`/books/${id}`); loadBooks(); }
    catch { alert("Error: Book not found or already deleted."); }
  };

  return (
    <div style={{ padding: 30, background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ color: primaryColor, marginBottom: 30 }}>Books Management</h1>

      {/* Filters */}
      <section style={{ marginBottom: 30, padding: 20, background: "#fff", borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: 15 }}>Filters</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 15 }}>
          <select name="author_id" onChange={handleFilterChange} style={inputStyle}>
            <option value="">Filter by Author</option>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          <select name="category_id" onChange={handleFilterChange} style={inputStyle}>
            <option value="">Filter by Category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <input type="number" name="year" placeholder="Exact Year" onChange={handleFilterChange} style={inputStyle} />
          <input type="number" name="limit" placeholder="Limit N" onChange={handleFilterChange} style={inputStyle} />

          <label style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <input type="checkbox" name="sortAZ" checked={filters.sortAZ} onChange={(e) => setFilters({ ...filters, sortAZ: e.target.checked })} />
            Sort by Title (A → Z)
          </label>
        </div>
      </section>

      {/* Form */}
      <section style={{ marginBottom: 30, padding: 20, background: "#fff", borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: 15 }}>{formData.id ? "Edit Book" : "Add Book"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: 15 }}>
          <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required style={inputStyle} />
          <input name="isbn" placeholder="ISBN" value={formData.isbn} onChange={handleChange} required style={inputStyle} />
          <input name="year" type="number" placeholder="Year" value={formData.year} onChange={handleChange} required style={inputStyle} />
          <select name="author_id" value={formData.author_id} onChange={handleChange} required style={inputStyle}>
            <option value="">Select Author</option>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <select name="category_id" value={formData.category_id} onChange={handleChange} required style={inputStyle}>
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button type="submit" style={{ ...buttonStyle, backgroundColor: primaryColor }}>
            {formData.id ? "Update Book" : "Add Book"}
          </button>
        </form>
      </section>

      {/* Books Table */}
      <section style={{ padding: 20, background: "#fff", borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#eee" }}>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>ISBN</th>
              <th style={thStyle}>Year</th>
              <th style={thStyle}>Authors</th>
              <th style={thStyle}>Categories</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 20 }}>No books found.</td>
              </tr>
            )}
            {books.map((b) => (
              <tr key={b.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{b.title}</td>
                <td style={tdStyle}>{b.isbn}</td>
                <td style={tdStyle}>{b.year}</td>
                <td style={tdStyle}>{Array.isArray(b.authors) ? b.authors.join(", ") : b.authors}</td>
                <td style={tdStyle}>{Array.isArray(b.categories) ? b.categories.join(", ") : b.categories}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(b)} style={{ ...actionButton, backgroundColor: "#1988d8" }}>Edit</button>
                  <button onClick={() => handleDelete(b.id)} style={{ ...actionButton, backgroundColor: "#dc3545" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

// Styles
const inputStyle = { padding: "8px 12px", borderRadius: 5, border: "1px solid #ccc", minWidth: 150 };
const buttonStyle = { padding: "10px 20px", border: "none", borderRadius: 5, color: "#fff", cursor: "pointer" };
const thStyle = { padding: 12, textAlign: "left" };
const tdStyle = { padding: 12 };
const actionButton = { padding: "6px 12px", border: "none", borderRadius: 5, color: "#fff", cursor: "pointer", marginRight: 5 };