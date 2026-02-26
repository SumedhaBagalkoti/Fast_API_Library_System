import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Authors from "./pages/Authors";
import AuthorDetails from "./pages/AuthorDetails";
import Stats from "./pages/Stats";

export default function App() {
  const navLinkStyle = ({ isActive }) => ({
    marginRight: "20px",
    padding: "8px 16px",
    textDecoration: "none",
    borderRadius: "5px",
    backgroundColor: isActive ? "#3575b9" : "transparent",
    color: isActive ? "#fff" : "#333",
    fontWeight: isActive ? "600" : "500",
    transition: "all 0.2s",
  });

  return (
    <BrowserRouter>
      <header style={{
        padding: "15px 30px",
        background: "#f8f9fa",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
      }}>
        <h1 style={{ margin: 0, marginRight: "40px", fontSize: "1.5rem", color: "#3575b9" }}>Book Management</h1>
        <nav>
          <NavLink to="/" style={navLinkStyle}>Dashboard</NavLink>
          <NavLink to="/books" style={navLinkStyle}>Books</NavLink>
          <NavLink to="/authors" style={navLinkStyle}>Authors</NavLink>
          <NavLink to="/stats" style={navLinkStyle}>Stats</NavLink>
        </nav>
      </header>

      <main style={{ padding: "30px", minHeight: "calc(100vh - 70px)", background: "#f5f5f5" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/authors/:id" element={<AuthorDetails />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}