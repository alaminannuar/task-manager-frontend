import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        alert("Login failed. Check your credentials.");
        return;
      }

      const result = await response.json();
      localStorage.setItem("jwt", result.token);
      window.location.href = "/tasks";
    } catch (err) {
      console.error("Login error:", err);
      alert("Login error. Please try again later.");
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
        <button type="submit" style={buttonStyle}>
          Login
        </button>
      </form>
    </div>
  );
}
