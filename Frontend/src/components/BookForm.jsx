import { useState, useEffect } from "react";

export default function BookForm({
  book,
  authors,
  categories,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState({
    title: "",
    isbn: "",
    year: "",
    authors: [],
    categories: [],
  });

  useEffect(() => {
    if (book?.id) {
      setForm({
        title: book.title,
        isbn: book.isbn,
        year: book.year,
        authors: book.authors || [],
        categories: book.categories || [],
      });
    }
  }, [book]);

  const handleChange = (field, value) =>
    setForm({ ...form, [field]: value });

  const submit = () => {
    if (!form.title || !form.isbn || form.authors.length === 0) {
      alert("Title, ISBN and at least 1 author required!");
      return;
    }
    onSave(form);
  };

  return (
    <div style={{
      position: "fixed",
      top: 50,
      left: "50%",
      transform: "translateX(-50%)",
      background: "white",
      padding: 20,
      border: "1px solid black",
      width: 400
    }}>
      <h2>{book?.id ? "Edit Book" : "Add Book"}</h2>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => handleChange("title", e.target.value)}
      />

      <br /><br />

      <input
        placeholder="ISBN"
        value={form.isbn}
        onChange={(e) => handleChange("isbn", e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Publication Year"
        value={form.year}
        onChange={(e) => handleChange("year", e.target.value)}
      />

      <br /><br />

      <label>Authors</label>
      <select
        multiple
        value={form.authors}
        onChange={(e) =>
          handleChange(
            "authors",
            Array.from(e.target.selectedOptions, (o) => o.value)
          )
        }
      >
        {authors.map((a) => (
          <option key={a.id} value={a.name}>
            {a.name}
          </option>
        ))}
      </select>

      <br /><br />

      <label>Categories</label>
      <select
        multiple
        value={form.categories}
        onChange={(e) =>
          handleChange(
            "categories",
            Array.from(e.target.selectedOptions, (o) => o.value)
          )
        }
      >
        {categories.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={submit}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}