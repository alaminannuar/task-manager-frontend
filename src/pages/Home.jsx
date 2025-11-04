import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Use backend URL from .env, fallback to localhost for local testing
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const textbox = {
    padding: 8,
    margin: 5,
    borderRadius: 5,
    border: "1px solid #ccc",
    width: "200px",
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

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${backendURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        alert("Login failed. Check your credentials.");
        return;
      }

      const result = await response.json();
      localStorage.setItem("jwt", result.token);
      window.location.href = "/#/tasks";
    } catch (err) {
      console.error("Login error:", err);
      alert("Login error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Task Manager App</h1>
      <p>Please login to use the Task Manager</p>
      <form onSubmit={login}>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={textbox}
          required
        />
        <br />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={textbox}
          required
        />
        <br />
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
