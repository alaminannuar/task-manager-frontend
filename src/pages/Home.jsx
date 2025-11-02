import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const textbox = {
    padding: 5,
    margin: 5,
    placeItems: "center",
  };

  const login = async (e) => {
    e.preventDefault();
    console.log(`Email: ${email}`);

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const result = await response.json();
    localStorage.setItem("jwt", result.token);
    window.location.href = "/tasks";
  };

  return (
    <div>
      <h1>Welcome to the Task Manager App</h1>
      <p>Please login to use the Task Manager</p>
      <form>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={textbox}
        />
        <br />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={textbox}
        />
        <br />
        <input type="submit" onClick={login} />
      </form>
    </div>
  );
}
