import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.ok && result.token) {
        localStorage.setItem("jwt", result.token);
        navigate("/tasks");
      } else {
        alert(result || "Login failed!");
      }
    } catch (err) {
      console.log(err);
      alert("Login error!");
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Welcome to TaskApp 📝</h1>
      <p style={subtitleStyle}>Organize your tasks efficiently</p>

      <form onSubmit={login} style={formStyle}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={inputStyle}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>
          Login
        </button>
      </form>
    </div>
  );
}

// Styles
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "80vh",
  textAlign: "center",
};

const titleStyle = {
  fontSize: 36,
  color: "#1E90FF",
  marginBottom: 10,
};

const subtitleStyle = {
  fontSize: 18,
  marginBottom: 30,
  color: "#333",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "300px",
};

const inputStyle = {
  padding: 10,
  marginBottom: 15,
  width: "100%",
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 14,
};

const buttonStyle = {
  padding: 10,
  width: "100%",
  borderRadius: 8,
  border: "none",
  backgroundColor: "#1E90FF",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: 16,
  transition: "0.2s all",
};
