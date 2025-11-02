import { useState, useEffect } from "react";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [filter, setFilter] = useState("all"); // all, completed, pending

  const token = localStorage.getItem("jwt");
  const backendURL = import.meta.env.VITE_BACKEND_URL; // use Render backend URL

  // Fetch tasks from backend
  const getTasks = async () => {
    try {
      const response = await fetch(`${backendURL}/tasks`, {
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
      const response = await fetch(`${backendURL}/tasks`, {
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

    setTasks((prev) => [...prev, newTask]);

    const createdTask = await addTaskToBackend(newTask);
    if (createdTask && createdTask._id) {
      setTasks((prev) => [...prev.filter((t) => t !== newTask), createdTask]);
    }

    setTaskName("");
    setTaskDeadline("");
  };

  const toggleTask = async (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    try {
      await fetch(`${backendURL}/tasks/${task._id}`, {
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
    } catch (error) {
      console.log("Error updating task", error);
    }
  };

  const removeTask = async (task) => {
    try {
      await fetch(`${backendURL}/tasks/${task._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (error) {
      console.log("Error deleting task", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/";
  };

  const inputStyle = {
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    border: "1px solid #ccc",
    fontSize: 14,
  };

  const buttonStyle = {
    padding: "8px 15px",
    borderRadius: 5,
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const taskCardStyle = (task) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#f4f4f4",
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
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
  });

  const filteredTasks = tasks.filter((task) =>
    filter === "all"
      ? true
      : filter === "completed"
      ? task.completed
      : !task.completed
  );

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>My Tasks</h2>
        <button
          onClick={logout}
          style={{ ...buttonStyle, backgroundColor: "#f44336" }}
        >
          Logout
        </button>
      </div>

      {/* Task filter buttons */}
      <div style={{ marginBottom: 15 }}>
        <button onClick={() => setFilter("all")} style={{ marginRight: 5 }}>
          All
        </button>
        <button
          onClick={() => setFilter("completed")}
          style={{ marginRight: 5 }}
        >
          Completed
        </button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      {/* Add task form */}
      <form
        onSubmit={addTask}
        style={{ marginBottom: 20, display: "flex", flexWrap: "wrap" }}
      >
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task title"
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

      {/* Task list */}
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
