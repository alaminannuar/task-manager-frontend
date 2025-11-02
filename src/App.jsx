import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import TaskManager from "./pages/TaskManager";
import "./App.css";

function App() {
  return (
    <>
      <nav style={navStyle}>
        {/* Replace text with a logo */}
        <Link to="/" style={logoStyle}>
          📝 TaskApp
        </Link>
        <div>
          <Link to="/" style={navButtonStyle}>
            Home
          </Link>
          <Link to="/tasks" style={navButtonStyle}>
            Tasks
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<TaskManager />} />
      </Routes>
    </>
  );
}

// Styles
const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#1E90FF",
  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
  marginBottom: 20,
};

const logoStyle = {
  fontSize: 24,
  fontWeight: "bold",
  color: "white",
  textDecoration: "none",
};

const navButtonStyle = {
  marginLeft: 15,
  padding: "6px 12px",
  backgroundColor: "#87CEFA",
  color: "#fff",
  borderRadius: 6,
  textDecoration: "none",
  fontWeight: "bold",
  transition: "0.2s all",
};

export default App;
