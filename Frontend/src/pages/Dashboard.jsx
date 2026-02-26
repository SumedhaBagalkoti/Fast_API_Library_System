import { useEffect, useState } from "react";
import { apiGet } from "../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    avgYear: "N/A",
    booksPerAuthor: [],
    booksPerCategory: [],
    topAuthors: [],
    busyYears: [],
  });

  useEffect(() => {
    async function loadStats() {
      const total = await apiGet("/stats/total-books");
      const avg = await apiGet("/stats/avg-year");
      const counts = await apiGet("/stats/counts");
      const insights = await apiGet("/books/insights");

      setStats({
        totalBooks: total.total_books,
        avgYear: avg.average_year,
        booksPerAuthor: counts.books_per_author,
        booksPerCategory: counts.books_per_category,
        topAuthors: insights.top_authors,
        busyYears: insights.busy_years,
      });
    }

    loadStats();
  }, []);

  return (
    <div style={{ padding: 30, background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ color: "#3575b9", marginBottom: 30 }}>Library Dashboard</h1>

      {/* TOP CARDS */}
      <div
        className="cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 20,
        }}
      >
        <StatCard title="Total Books" value={stats.totalBooks} />
        <StatCard title="Average Year" value={stats.avgYear} />
        <StatCard
          title="Books Per Author"
          value={stats.booksPerAuthor.length}
        />
        <StatCard
          title="Books Per Category"
          value={stats.booksPerCategory.length}
        />
        <StatCard title="Top 5 Authors" value={stats.topAuthors.length} />
        {/* <StatCard title="Busy Years (2+ books)" value={stats.busyYears.length} /> */}
      </div>

      {/* INSIGHTS DETAILS */}
      <div style={{ marginTop: 50 }}>
        <h2 style={{ color: "#333", marginBottom: 20 }}>Top Authors</h2>
        <div
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 8,
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {stats.topAuthors.map((a) => (
              <li
                key={a.author}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 500,
                }}
              >
                <span>{a.author}</span>
                <span>{a.total_books} books</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Optional Busy Years Section */}
        {/* <h2 style={{ marginTop: 40 }}>Busy Years</h2>
        <ul>
          {stats.busyYears.map((y) => (
            <li key={y.year}>
              <strong>{y.year}</strong>: {y.books.join(", ")}
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 10,
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        textAlign: "center",
        transition: "all 0.2s",
      }}
    >
      <h3 style={{ marginBottom: 10, color: "#555", fontWeight: 500 }}>
        {title}
      </h3>
      <p style={{ fontSize: 24, fontWeight: 600, color: "#3575b9" }}>{value}</p>
    </div>
  );
}