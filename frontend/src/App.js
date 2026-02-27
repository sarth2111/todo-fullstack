import "./App.css";
import React, { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchTasks = () => {
    fetch("http://127.0.0.1:5000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = () => {
    if (!title.trim()) return;

    fetch("http://127.0.0.1:5000/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    })
      .then(res => res.json())
      .then(() => {
        setTitle("");
        fetchTasks();
      });
  };

  const deleteTask = (id) => {
    fetch(`http://127.0.0.1:5000/delete/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(() => fetchTasks());
  };

  const toggleComplete = (id, currentStatus) => {
    fetch(`http://127.0.0.1:5000/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !currentStatus })
    })
      .then(res => res.json())
      .then(() => fetchTasks());
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;

  return (
  <div className="app-container">
    <h2>Khushi's Daily Planner</h2>

    <div className="input-section">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
        placeholder="Add something beautiful..."
      />
      <button onClick={addTask} disabled={!title.trim()}>
        Add
      </button>
    </div>

    {/* FILTER BUTTONS */}
    <div style={{ marginTop: "15px", textAlign: "center" }}>
      <button onClick={() => setFilter("all")}>All</button>
      <button onClick={() => setFilter("completed")} style={{ marginLeft: "10px" }}>
        Completed
      </button>
      <button onClick={() => setFilter("pending")} style={{ marginLeft: "10px" }}>
        Pending
      </button>
    </div>

    {/* TASK LIST */}
    <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
      {filteredTasks.map(task => (
        <li key={task.id} className="task-item">
          <div>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id, task.completed)}
            />
            <span className={task.completed ? "completed" : ""} style={{ marginLeft: "10px" }}>
              {task.title}
            </span>
          </div>

          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </li>
      ))}
    </ul>

    {/* COUNTER */}
    <div style={{ textAlign: "center", marginTop: "10px" }}>
      Total: {tasks.length} | Completed: {tasks.filter(t => t.completed).length}
    </div>
  </div>
);
}

export default App;