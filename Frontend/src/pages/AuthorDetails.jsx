import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../api/api";

export default function AuthorDetails() {
  const { id } = useParams();
  const primaryColor = "#3575b9";

  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [hasBooks, setHasBooks] = useState(null);

  useEffect(() => {
    loadAll();
  }, [id]);

  async function loadAll() {
    apiGet(`/authors/${id}`).then(setAuthor);
    apiGet(`/books?author_id=${id}`).then(setBooks);
    apiGet(`/stats/author-range/${id}`).then(setStats);
    checkAuthorHasBooks(id);
  }

  async function checkAuthorHasBooks(authorId) {
    try {
      const res = await apiGet(`/stats/author-has-books/${authorId}`);
      setHasBooks(res.has_books);
    } catch (err) {
      setHasBooks(false);
    }
  }

  if (!author || !stats) return <p>Loading...</p>;

  return (
    <div style={{ padding: 30, background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ color: primaryColor, marginBottom: 20 }}>{author.name}</h1>

      {/* BOOKS LIST */}
      <h2 style={{ color: primaryColor, marginBottom: 15 }}>Books by {author.name}</h2>
      <div style={{ background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
        <ul>
          {books
            .sort((a, b) => a.year - b.year)
            .map((b) => (
              <li key={b.id} style={{ marginBottom: 5 }}>
                <strong>{b.year}</strong> — {b.title}
              </li>
            ))}
          {books.length === 0 && <li>No books found.</li>}
        </ul>
      </div>

      {/* STATS CARDS */}
      <h2 style={{ color: primaryColor, marginTop: 30, marginBottom: 15 }}>Stats</h2>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <StatCard title="Earliest Book" value={stats?.earliest_book || "N/A"} />
        <StatCard title="Latest Book" value={stats?.latest_book || "N/A"} />
        <StatCard title="Has At Least One Book?" value={hasBooks === null ? "Loading..." : hasBooks ? "YES" : "NO"} />
      </div>
    </div>
  );
}

// Reusable Card Component
function StatCard({ title, value }) {
  const primaryColor = "#3575b9";
  return (
    <div style={{
      padding: 20,
      borderRadius: 10,
      background: "#fff",
      minWidth: 200,
      textAlign: "center",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
    }}>
      <h3 style={{ marginBottom: 10, color: "#555" }}>{title}</h3>
      <p style={{ fontSize: 20, fontWeight: 600, color: primaryColor }}>{value}</p>
    </div>
  );
}