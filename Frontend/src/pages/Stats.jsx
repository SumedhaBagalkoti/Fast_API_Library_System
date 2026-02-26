// import { useEffect, useState } from "react";

// export default function StatsPage() {
//   const API = "http://localhost:8000";
//   const primaryColor = "#3575b9";

//   // Base stats
//   const [totalBooks, setTotalBooks] = useState(null);
//   const [avgYear, setAvgYear] = useState(null);

//   // Author range stats
//   const [authors, setAuthors] = useState([]);
//   const [selectedAuthor, setSelectedAuthor] = useState("");
//   const [earliest, setEarliest] = useState(null);

//   // First N books
//   const [n, setN] = useState("");
//   const [firstNBooks, setFirstNBooks] = useState([]);

//   // Author has books?
//   const [hasBooks, setHasBooks] = useState(null);

//   // Counts
//   const [counts, setCounts] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadBaseStats();
//     loadAuthors();
//     loadCounts();
//   }, []);

//   async function loadBaseStats() {
//     try {
//       const total = await fetch(`${API}/stats/total-books`).then(r => r.json());
//       const avg = await fetch(`${API}/stats/avg-year`).then(r => r.json());
//       setTotalBooks(total.total_books);
//       setAvgYear(avg.average_year);
//     } catch (err) {
//       setError("Failed to load stats.");
//     }
//   }

//   async function loadAuthors() {
//     const res = await fetch(`${API}/authors/`).then(r => r.json());
//     setAuthors(res);
//   }

//   async function loadAuthorStats(id) {
//     if (!id) return;
//     setLoading(true);
//     setError("");
//     try {
//       const earliestBook = await fetch(`${API}/stats/author-range/${id}`).then(r => r.json());
//       setEarliest(earliestBook);
//     } catch (err) {
//       setError("Could not load author stats.");
//     }
//     setLoading(false);
//   }

//   async function checkAuthorHasBooks(id) {
//     if (!id) return;
//     try {
//       const res = await fetch(`${API}/stats/author-has-books/${id}`).then(r => r.json());
//       setHasBooks(res.has_books);
//     } catch (err) {
//       setError("Cannot check author's books");
//     }
//   }

//   async function loadFirstNBooks() {
//     if (!n) return;
//     try {
//       const books = await fetch(`${API}/stats/first-n-books/${n}`).then(r => r.json());
//       setFirstNBooks(books);
//     } catch {
//       setError("Failed to load first N books");
//     }
//   }

//   async function loadCounts() {
//     try {
//       const res = await fetch(`${API}/stats/counts`).then(r => r.json());
//       setCounts(res);
//     } catch {
//       setError("Failed to load counts");
//     }
//   }

//   return (
//     <div style={{ padding: 30, background: "#f5f5f5", minHeight: "100vh" }}>
//       <h1 style={{ color: primaryColor, marginBottom: 30 }}>Library Stats</h1>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {/* BASE STATS */}
//       <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
//         <StatCard title="Total Books" value={totalBooks ?? "..."} />
//         <StatCard title="Average Publication Year" value={avgYear ?? "..."} />
//       </div>

//       <hr style={{ margin: "30px 0" }} />

//       {/* AUTHOR STATS */}
//       <h2 style={{ color: primaryColor, marginBottom: 15 }}>Author Statistics</h2>
//       <select
//         value={selectedAuthor}
//         onChange={(e) => {
//           setSelectedAuthor(e.target.value);
//           loadAuthorStats(e.target.value);
//           checkAuthorHasBooks(e.target.value);
//         }}
//         style={selectStyle}
//       >
//         <option value="">Select an Author</option>
//         {authors.map(a => (
//           <option key={a.id} value={a.id}>{a.name}</option>
//         ))}
//       </select>

//       {loading && <p style={{ marginTop: 10 }}>Loading author stats...</p>}

//       {selectedAuthor && !loading && (
//         <div style={{ marginTop: 20, background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
//           <h3 style={{ marginBottom: 10 }}>Earliest and Latest Book</h3>
//           <p>Author ID: {earliest?.author_id || "N/A"}</p>
//           <p>Earliest Book: {earliest?.earliest_book || "N/A"}</p>
//           <p>Latest Book: {earliest?.latest_book || "N/A"}</p>

//           <h3 style={{ marginTop: 15 }}>Has at least one book?</h3>
//           <p>{hasBooks === null ? "..." : hasBooks ? "YES" : "NO"}</p>
//         </div>
//       )}

//       <hr style={{ margin: "30px 0" }} />

//       {/* FIRST N BOOKS */}
//       <h2 style={{ color: primaryColor, marginBottom: 15 }}>First N Books (Sorted A–Z)</h2>
//       <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
//         <input
//           type="number"
//           placeholder="Enter N"
//           value={n}
//           onChange={(e) => setN(e.target.value)}
//           style={inputStyle}
//         />
//         <button onClick={loadFirstNBooks} style={{ ...buttonStyle, backgroundColor: primaryColor }}>Load</button>
//       </div>
//       {firstNBooks.length > 0 && (
//         <ul style={{ background: "#fff", padding: 15, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
//           {firstNBooks.map(b => <li key={b.id}>{b.title}</li>)}
//         </ul>
//       )}

//       <hr style={{ margin: "30px 0" }} />

//       {/* COUNTS */}
//       <h2 style={{ color: primaryColor, marginBottom: 15 }}>Books Per Author & Category</h2>
//       {counts && (
//         <div style={{ display: "flex", gap: 50, flexWrap: "wrap" }}>
//           <div style={countCardStyle}>
//             <h3>Books Per Author</h3>
//             <ul>
//               {counts.books_per_author.map(a => (
//                 <li key={a.author}>{a.author}: {a.total_books}</li>
//               ))}
//             </ul>
//           </div>

//           <div style={countCardStyle}>
//             <h3>Books Per Category</h3>
//             <ul>
//               {counts.books_per_category.map(c => (
//                 <li key={c.category}>{c.category}: {c.total_books}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Reusable components & styles
// function StatCard({ title, value }) {
//   const primaryColor = "#3575b9";
//   return (
//     <div style={{ padding: 20, borderRadius: 10, background: "#fff", width: 220, textAlign: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
//       <h3 style={{ marginBottom: 10, color: "#555" }}>{title}</h3>
//       <p style={{ fontSize: 24, fontWeight: 600, color: primaryColor }}>{value}</p>
//     </div>
//   );
// }

// const selectStyle = { padding: 8, borderRadius: 5, border: "1px solid #ccc", minWidth: 200 };
// const inputStyle = { padding: 8, borderRadius: 5, border: "1px solid #ccc", minWidth: 120 };
// const buttonStyle = { padding: "8px 16px", border: "none", borderRadius: 5, color: "#fff", cursor: "pointer" };
// const countCardStyle = { background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)", minWidth: 220 };

import { useEffect, useState } from "react";

export default function StatsPage() {
  const API = "http://localhost:8000";
  const primaryColor = "#3575b9";

  // Base stats
  const [totalBooks, setTotalBooks] = useState(null);
  const [avgYear, setAvgYear] = useState(null);

  // Author range stats
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [earliest, setEarliest] = useState(null);

  // First N books
  const [n, setN] = useState("");
  const [firstNBooks, setFirstNBooks] = useState([]);

  // Author has books?
  const [hasBooks, setHasBooks] = useState(null);

  // Counts
  const [counts, setCounts] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBaseStats();
    loadAuthors();
    loadCounts();
  }, []);

  async function loadBaseStats() {
    try {
      const total = await fetch(`${API}/stats/total-books`).then(r => r.json());
      const avg = await fetch(`${API}/stats/avg-year`).then(r => r.json());
      setTotalBooks(total.total_books);
      setAvgYear(avg.average_year);
    } catch (err) {
      setError("Failed to load stats.");
    }
  }

  async function loadAuthors() {
    const res = await fetch(`${API}/authors/`).then(r => r.json());
    setAuthors(res);
  }

  async function loadAuthorStats(id) {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const earliestBook = await fetch(`${API}/stats/author-range/${id}`).then(r => r.json());
      setEarliest(earliestBook);
    } catch (err) {
      setError("Could not load author stats.");
    }
    setLoading(false);
  }

  async function checkAuthorHasBooks(id) {
    if (!id) return;
    try {
      const res = await fetch(`${API}/stats/author-has-books/${id}`).then(r => r.json());
      setHasBooks(res.has_books);
    } catch {
      setHasBooks(false);
    }
  }

  async function loadFirstNBooks() {
    if (!n) return;
    try {
      const books = await fetch(`${API}/stats/first-n-books/${n}`).then(r => r.json());
      setFirstNBooks(books);
    } catch {
      setError("Failed to load first N books");
    }
  }

  async function loadCounts() {
    try {
      const res = await fetch(`${API}/stats/counts`).then(r => r.json());
      setCounts(res);
    } catch {
      setError("Failed to load counts");
    }
  }

  return (
    <div style={{ padding: 30, background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ color: primaryColor, marginBottom: 30 }}>Library Stats</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* BASE STATS */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <StatCard title="Total Books" value={totalBooks ?? "..."} />
        <StatCard title="Average Publication Year" value={avgYear ?? "..."} />
      </div>

      {/* AUTHOR STATS */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ color: primaryColor, marginBottom: 15 }}>Author Statistics</h2>
        <select
          value={selectedAuthor}
          onChange={(e) => {
            setSelectedAuthor(e.target.value);
            loadAuthorStats(e.target.value);
            checkAuthorHasBooks(e.target.value);
          }}
          style={selectStyle}
        >
          <option value="">Select an Author</option>
          {authors.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        {loading && <p style={{ marginTop: 10 }}>Loading author stats...</p>}

        {selectedAuthor && !loading && (
          <div style={{ marginTop: 20, background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <h3 style={{ marginBottom: 10 }}>Earliest and Latest Book</h3>
            <p>Author ID: {earliest?.author_id || "N/A"}</p>
            <p>Earliest Book: {earliest?.earliest_book || "N/A"}</p>
            <p>Latest Book: {earliest?.latest_book || "N/A"}</p>

            <h3 style={{ marginTop: 15 }}>Has at least one book?</h3>
            <p>{hasBooks === null ? "..." : hasBooks ? "YES" : "NO"}</p>
          </div>
        )}
      </div>

      {/* FIRST N BOOKS */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ color: primaryColor, marginBottom: 15 }}>First N Books (Sorted A–Z)</h2>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <input
            type="number"
            placeholder="Enter N"
            value={n}
            onChange={(e) => setN(e.target.value)}
            style={inputStyle}
          />
          <button onClick={loadFirstNBooks} style={{ ...buttonStyle, backgroundColor: primaryColor }}>Load</button>
        </div>
        {firstNBooks.length > 0 && (
          <ul style={{ background: "#fff", padding: 15, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            {firstNBooks.map(b => <li key={b.id}>{b.title}</li>)}
          </ul>
        )}
      </div>

      {/* COUNTS */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ color: primaryColor, marginBottom: 15 }}>Books Per Author & Category</h2>
        {counts && (
          <div style={{ display: "flex", gap: 50, flexWrap: "wrap" }}>
            <div style={countCardStyle}>
              <h3>Books Per Author</h3>
              <ul>
                {counts.books_per_author.map(a => (
                  <li key={a.author}>{a.author}: {a.total_books}</li>
                ))}
              </ul>
            </div>

            <div style={countCardStyle}>
              <h3>Books Per Category</h3>
              <ul>
                {counts.books_per_category.map(c => (
                  <li key={c.category}>{c.category}: {c.total_books}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable components & styles
function StatCard({ title, value }) {
  const primaryColor = "#3575b9";
  return (
    <div style={{ padding: 20, borderRadius: 10, background: "#fff", width: 220, textAlign: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
      <h3 style={{ marginBottom: 10, color: "#555" }}>{title}</h3>
      <p style={{ fontSize: 24, fontWeight: 600, color: primaryColor }}>{value}</p>
    </div>
  );
}

const selectStyle = { padding: 8, borderRadius: 5, border: "1px solid #ccc", minWidth: 200 };
const inputStyle = { padding: 8, borderRadius: 5, border: "1px solid #ccc", minWidth: 120 };
const buttonStyle = { padding: "8px 16px", border: "none", borderRadius: 5, color: "#fff", cursor: "pointer" };
const countCardStyle = { background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.1)", minWidth: 220 };