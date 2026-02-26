import { useState, useEffect } from "react";

export default function AuthorForm({ author, onSave, onCancel }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (author?.name) setName(author.name);
  }, [author]);

  const submit = () => {
    if (!name.trim()) return alert("Author name required");
    onSave({ name });
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
      width: 300
    }}>
      <h2>{author?.id ? "Edit Author" : "Add Author"}</h2>

      <input
        type="text"
        placeholder="Author Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <button onClick={submit}>Save</button>
      <button onClick={onCancel} style={{ marginLeft: 10 }}>Cancel</button>
    </div>
  );
}