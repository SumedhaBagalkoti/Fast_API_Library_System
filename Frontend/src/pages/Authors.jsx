import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiPost, apiPut, apiDelete } from "../api/api";
import AuthorForm from "../components/AuthorForm";

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [editingAuthor, setEditingAuthor] = useState(null); 
  const [mode, setMode] = useState(""); // "add" or "edit"
  const primaryColor = "#3575b9";

  const load = async () => {
    const data = await apiGet("/authors");
    setAuthors(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this author?")) return;
    await apiDelete(`/authors/${id}`);
    load();
  };

  const addAuthor = async (data) => {
    await apiPost("/authors", data);
    setEditingAuthor(null);
    setMode("");
    load();
  };

  const updateAuthor = async (data) => {
    await apiPut(`/authors/${editingAuthor.id}`, data);
    setEditingAuthor(null);
    setMode("");
    load();
  };

  return (
    <div style={{ padding: 30, background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ color: primaryColor, marginBottom: 30 }}>Authors</h1>

      {/* ADD BUTTON */}
      <button
        onClick={() => {
          setMode("add");
          setEditingAuthor({ name: "" });
        }}
        style={{ ...buttonStyle, backgroundColor: primaryColor }}
      >
        + Add Author
      </button>

      {/* AUTHORS TABLE */}
      <div style={{ marginTop: 20, background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Total Books</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: 20 }}>No authors found.</td>
              </tr>
            )}
            {authors.map((a) => (
              <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>
                  <Link to={`/authors/${a.id}`} style={{ color: primaryColor, textDecoration: "none", fontWeight: 500 }}>
                    {a.name}
                  </Link>
                </td>
                <td style={tdStyle}>{a.book_count || 0}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => { setMode("edit"); setEditingAuthor(a); }}
                    style={{ ...actionButton, backgroundColor: "#ffc107" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    style={{ ...actionButton, backgroundColor: "#dc3545" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM POPUP */}
      {editingAuthor && (
        <AuthorForm
          author={editingAuthor}
          onCancel={() => { setEditingAuthor(null); setMode(""); }}
          onSave={(data) => { mode === "add" ? addAuthor(data) : updateAuthor(data); }}
          primaryColor={primaryColor} // pass color for consistent styling
        />
      )}
    </div>
  );
}

// Styles
const buttonStyle = { padding: "10px 20px", border: "none", borderRadius: 5, color: "#fff", cursor: "pointer", fontWeight: 500 };
const thStyle = { padding: 12, textAlign: "left" };
const tdStyle = { padding: 12 };
const actionButton = { padding: "6px 12px", border: "none", borderRadius: 5, color: "#fff", cursor: "pointer", marginRight: 5 };