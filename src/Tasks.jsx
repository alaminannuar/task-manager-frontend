import { useState, useEffect } from "react";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const token = localStorage.getItem("jwt");

  // Fetch tasks on load
  useEffect(() => {
    fetch("http://localhost:3000/tasks", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  // Create new task
  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, deadline })
    });
    const newTask = await res.json();
    setTasks(prev => [...prev, newTask]);
    setTitle(""); setDescription(""); setDeadline("");
  };

  // Delete task
  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(prev => prev.filter(task => task._id !== id));
  };

  return (
    <div>
      <h1>My Tasks</h1>

      {/* Form to create task */}
      <form onSubmit={handleCreate}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required />
        <button type="submit">Add Task</button>
      </form>

      {/* Display tasks */}
      {tasks.length === 0 ? <p>No tasks yet!</p> : null}
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
