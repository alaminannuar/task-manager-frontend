import { useState, useEffect } from "react";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [filter, setFilter] = useState("all"); // all, completed, pending
  const [highlightTaskId, setHighlightTaskId] = useState(null); // for adding/removing animations

  const token = localStorage.getItem("jwt");

  // Fetch tasks from backend
  const getTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        window.location.href = "/";
        return;
      }
      const result = await response.json();
      result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      setTasks(result);
    } catch (error) {
      console.log("Error fetching tasks", error);
      window.location.href = "/";
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addTaskToBackend = async (task) => {
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log("Error adding task", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!taskName.trim() || !taskDeadline) return;

    const newTask = {
      title: taskName,
      deadline: taskDeadline,
      completed: false,
    };

    // Highlight newly added task
    setHighlightTaskId("new");

    setTasks((prev) => [...prev, newTask]);

    const createdTask = await addTaskToBackend(newTask);
    if (createdTask && createdTask._id) {
      setTasks((prev) => [...prev.filter((t) => t !== newTask), createdTask]);
      setHighlightTaskId(createdTask._id);
      setTimeout(() => setHighlightTaskId(null), 1000);
    }

    setTaskName("");
    setTaskDeadline("");
  };

  const toggleTask = async (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    try {
      await fetch(`http://localhost:3000/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: updatedTask.completed }),
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? updatedTask : t))
      );

      // temporary highlight for completed/uncompleted
      setHighlightTaskId(task._id);
      setTimeout(() => setHighlightTaskId(null), 500);
    } catch (error) {
      console.log("Error updating task", error);
    }
  };

  const removeTask = async (task) => {
    try {
      setHighlightTaskId(task._id); // highlight before removing
      setTimeout(() => {
        setTasks((prev) => prev.filter((t) => t._id !== task._id));
      }, 300);

      await fetch(`http://localhost:3000/tasks/${task._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log("Error deleting task", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/";
  };

  // Styles
  const containerStyle = { padding: 20, maxWidth: 600, margin: "0 auto" };
  const inputStyle = {
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
    flex: 1,
    marginBottom: 10,
  };
  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#1E90FF",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 14,
    marginBottom: 10,
    transition: "all 0.2s",
  };
  const taskCardStyle = (task) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor:
      highlightTaskId === task._id
        ? "#d1ffd6" // highlight added/completed/deleted
        : "#f0f8ff",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
    transform: highlightTaskId === task._id ? "scale(1.02)" : "scale(1)",
    transition: "all 0.3s ease",
    opacity: task.completed ? 0.6 : 1,
  });
  const titleStyle = (task) => ({
    textDecoration: task.completed ? "line-through" : "none",
    color:
      !task.completed && new Date(task.deadline) < new Date() ? "red" : "#333",
    fontWeight:
      !task.completed && new Date(task.deadline) < new Date()
        ? "bold"
        : "normal",
    transition: "color 0.3s ease, text-decoration 0.3s ease",
  });

  const filteredTasks = tasks.filter((task) =>
    filter === "all"
      ? true
      : filter === "completed"
      ? task.completed
      : !task.completed
  );

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <h2 style={{ color: "#1E90FF" }}>My Tasks</h2>
        <button
          onClick={logout}
          style={{ ...buttonStyle, backgroundColor: "#f44336" }}
        >
          Logout
        </button>
      </div>

      {/* Filter Buttons */}
      <div style={{ marginBottom: 15 }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            ...buttonStyle,
            backgroundColor: filter === "all" ? "#1C86EE" : "#87CEFA",
            marginRight: 5,
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          style={{
            ...buttonStyle,
            backgroundColor: filter === "completed" ? "#1C86EE" : "#87CEFA",
            marginRight: 5,
          }}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("pending")}
          style={{
            ...buttonStyle,
            backgroundColor: filter === "pending" ? "#1C86EE" : "#87CEFA",
          }}
        >
          Pending
        </button>
      </div>

      {/* Add Task Form */}
      <form onSubmit={addTask} style={{ display: "flex", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Task title"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="date"
          value={taskDeadline}
          onChange={(e) => setTaskDeadline(e.target.value)}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>
          Add Task
        </button>
      </form>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredTasks.map((task) => (
            <li key={task._id} style={taskCardStyle(task)}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task)}
                />
                <span style={{ marginLeft: 10, ...titleStyle(task) }}>
                  {task.title} ({new Date(task.deadline).toLocaleDateString()})
                </span>
              </div>
              <button
                onClick={() => removeTask(task)}
                style={{ ...buttonStyle, backgroundColor: "#f44336" }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
