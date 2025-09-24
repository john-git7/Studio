import { useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister() {
    const res = await apiRequest("/auth/register", "POST", { name, email, password });
    if (res.error) return alert(res.error);

    alert("Registered! Please login.");
    navigate("/login");
  }

  // Detect role from email
  const isAdminRegister = email.toLowerCase().includes("@admin");
  const themeColors = isAdminRegister
    ? {
        primary: "#4e73df",      // blue for admin
        button: "#4e73df",
        buttonHover: "#3751c6",
        border: "#c7d4f5",
      }
    : {
        primary: "#20c997",      // teal for users
        button: "#20c997",
        buttonHover: "#1aa179",
        border: "#c1eae1",
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
          {isAdminRegister ? "Admin Register" : "User Register"}
        </h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          onClick={handleRegister}
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
          Register
        </button>
      </div>
    </div>
  );
}
