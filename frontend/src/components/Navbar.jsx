import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); 
  const closeMenu = () => setMenuOpen(false);

  // Determine navbar theme
  const isAdmin = user?.role === "admin";
  const navbarClass = isAdmin ? "navbar admin-navbar" : "navbar user-navbar";

  return (
    <>
      <nav className={navbarClass}>
        <div className="logo">
          <Link to="/" onClick={closeMenu}>📸 Priya Studio</Link>
        </div>

        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          {user ? (
            <>
              <Link to="/" onClick={closeMenu}>Home</Link>
              {isAdmin ? (
                <Link to="/admin" onClick={closeMenu} className="admin-link">Dashboard</Link>
              ) : (
                <Link to="/bookings" onClick={closeMenu}>My Bookings</Link>
              )}
              <button
                className="logout-btn"
                onClick={() => {
                  onLogout();
                  closeMenu();
                  navigate("/login"); 
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" onClick={closeMenu}>Home</Link>
              <Link to="/login" onClick={closeMenu}>Login</Link>
              <Link to="/register" onClick={closeMenu}>Register</Link>
            </>
          )}
        </div>
      </nav>

      {menuOpen && <div className="backdrop" onClick={closeMenu}></div>}
    </>
  );
}
