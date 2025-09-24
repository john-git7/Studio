import { useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const res = await apiRequest("/auth/login", "POST", { email, password });
      if (res.error) return alert(res.error);

      localStorage.setItem("user", JSON.stringify(res));
      setUser(res);
      navigate(res.role === "admin" ? "/admin" : "/");
    } catch (err) {
      alert(err.message);
    }
  }

  // Switch theme dynamically based on email input
  const isAdminLogin = email.toLowerCase().includes("@admin");
  const themeColors = isAdminLogin
    ? {
        primary: "#4e73df",      // blue for admin
        button: "#4e73df",
        buttonHover: "#3751c6",
        border: "#c7d4f5",
        text: "#333",
      }
    : {
        primary: "#20c997",      // teal for users
        button: "#20c997",
        buttonHover: "#1aa179",
        border: "#c1eae1",
        text: "#333",
      };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh",
      background: "#f8f9fc"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        width: "320px",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "20px", color: themeColors.primary }}>
          {isAdminLogin ? "Admin Login" : "User Login"}
        </h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            border: `1px solid ${themeColors.border}`,
            borderRadius: "8px",
            outline: "none",
            fontSize: "0.95rem"
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "18px",
            border: `1px solid ${themeColors.border}`,
            borderRadius: "8px",
            outline: "none",
            fontSize: "0.95rem"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            background: themeColors.button,
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.background = themeColors.buttonHover}
          onMouseLeave={(e) => e.target.style.background = themeColors.button}
        >
          Login
        </button>
      </div>
    </div>
  );
}
