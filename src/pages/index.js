import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [hoveredCheckbox, setHoveredCheckbox] = useState(null);
  const [filter, setFilter] = useState("todo"); // 'todo' or 'completed' or 'all'
  const [search, setSearch] = useState("");

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("todo_tasks");
      if (raw) setTasks(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load tasks", e);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("todo_tasks", JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks", e);
    }
  }, [tasks]);

  function addTask(e) {
    e?.preventDefault();
    const title = text.trim();
    if (!title) return;
    const newTask = { id: Date.now(), title, done: false, createdAt: new Date().toISOString() };
    setTasks((s) => [newTask, ...s]);
    setText("");
  }

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch (e) {
      return iso;
    }
  }

  function deleteTask(id) {
    setTasks((s) => s.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingText("");
    }
  }

  function toggleDone(id) {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditingText(task.title);
  }

  function saveEdit(e) {
    e?.preventDefault();
    if (editingText.trim() === "") return;
    setTasks((s) => s.map((t) => (t.id === editingId ? { ...t, title: editingText } : t)));
    setEditingId(null);
    setEditingText("");
  }

  function filteredTasks() {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filter === "todo" && t.done) return false;
      if (filter === "completed" && !t.done) return false;
      if (q && !t.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  const list = filteredTasks();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#eef2ff 0%, #f0fdf4 100%)", padding: 32, fontFamily: "Inter, Arial, sans-serif" }}>
      <main style={{ maxWidth: 900, margin: "0 auto", background: "linear-gradient(180deg,#ffffff, #fbfdff)", padding: 28, borderRadius: 14, boxShadow: "0 10px 30px rgba(2,6,23,0.08)", border: "1px solid rgba(15,23,42,0.04)" }}>
        <header style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}>
          <div style={{ width: 10, height: 40, borderRadius: 6, background: "linear-gradient(180deg,#7c3aed,#06b6d4)" }} />
          <div>
            <h1 style={{ margin: 0, fontSize: 24 }}>Aurora To‑Do</h1>
            <p style={{ margin: 0, marginTop: 4, color: "#334155" }}>Create, update, and organize your tasks with timestamps.</p>
          </div>
        </header>

        <form onSubmit={addTask} style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            aria-label="New task"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task"
            style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid rgba(2,6,23,0.06)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)" }}
          />
          <button type="submit" style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: "linear-gradient(90deg,#06b6d4,#7c3aed)", color: "white", boxShadow: "0 6px 18px rgba(124,58,237,0.18)" }}>Add</button>
        </form>

        <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setFilter("todo")} style={{ padding: "8px 12px", borderRadius: 6, border: filter === "todo" ? "2px solid #0ea5a4" : "1px solid #e2e8f0", background: filter === "todo" ? "#f0fdfa" : "white" }}>To Do</button>
            <button onClick={() => setFilter("completed")} style={{ padding: "8px 12px", borderRadius: 6, border: filter === "completed" ? "2px solid #0ea5a4" : "1px solid #e2e8f0", background: filter === "completed" ? "#f0fdfa" : "white" }}>Completed</button>
            <button onClick={() => setFilter("all")} style={{ padding: "8px 12px", borderRadius: 6, border: filter === "all" ? "2px solid #0ea5a4" : "1px solid #e2e8f0", background: filter === "all" ? "#f0fdfa" : "white" }}>All</button>
          </div>

          <input
            aria-label="Search tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            style={{ marginLeft: "auto", padding: 8, borderRadius: 6, border: "1px solid #e2e8f0", width: 220 }}
          />
        </div>

        <section style={{ marginTop: 18 }}>
          {list.length === 0 ? (
            <p style={{ color: "#64748b" }}>No tasks found.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
              {list.map((t) => (
                <li
                  key={t.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: 12,
                    borderRadius: 10,
                    border: "1px solid rgba(2,6,23,0.04)",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(250,250,255,0.8))",
                    boxShadow: "0 6px 18px rgba(10,11,13,0.03)",
                    borderLeft: `6px solid ${t.done ? '#34d399' : '#60a5fa'}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleDone(t.id)}
                    onMouseEnter={() => setHoveredCheckbox(t.id)}
                    onMouseLeave={() => setHoveredCheckbox(null)}
                    style={{
                      width: 22,
                      height: 22,
                      cursor: "pointer",
                      accentColor: t.done ? "#34d399" : "#60a5fa",
                      transition: "transform 120ms ease",
                      transform: hoveredCheckbox === t.id ? "scale(1.2)" : "scale(1)",
                    }}
                  />

                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    {editingId === t.id ? (
                      <form onSubmit={saveEdit} style={{ display: "flex", gap: 8 }}>
                        <input value={editingText} onChange={(e) => setEditingText(e.target.value)} style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #e2e8f0" }} />
                        <button type="submit" style={{ padding: "8px 10px", borderRadius: 6, background: "#0ea5a4", color: "white", border: "none" }}>Save</button>
                        <button type="button" onClick={() => { setEditingId(null); setEditingText(""); }} style={{ padding: "8px 10px", borderRadius: 6 }}>Cancel</button>
                      </form>
                    ) : (
                      <>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <span style={{ fontWeight: 600, textDecoration: t.done ? "line-through" : "none", color: t.done ? "#64748b" : "#0f172a" }}>{t.title}</span>
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>{formatDate(t.createdAt)}</span>
                        </div>
                        <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>{t.done ? 'Completed' : 'Pending'}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => startEdit(t)} style={{ padding: "6px 10px", borderRadius: 8, background: "#f1f5f9", border: "1px solid rgba(2,6,23,0.04)" }}>Edit</button>
                    <button onClick={() => deleteTask(t.id)} style={{ padding: "6px 10px", borderRadius: 8, background: "#ef4444", color: "white", border: "none" }}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer style={{ marginTop: 18, color: "#475569" }}>
          <strong>{tasks.filter((t) => !t.done).length}</strong> remaining — <strong>{tasks.filter((t) => t.done).length}</strong> completed
        </footer>
      </main>
    </div>
  );
}
