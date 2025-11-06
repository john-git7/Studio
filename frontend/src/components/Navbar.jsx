import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme colors
  const theme = user?.role === "admin"
    ? {
        gradient: "from-indigo-500 via-purple-500 to-pink-500",
        button: "bg-indigo-600 hover:bg-indigo-700",
        hoverText: "hover:text-pink-300",
      }
    : {
        gradient: "from-teal-400 via-cyan-500 to-blue-500",
        button: "bg-teal-600 hover:bg-teal-700",
        hoverText: "hover:text-cyan-300",
      };

  // Navigation links
  const navLinks = [{ name: "Home", path: "/" }];
  if (user?.role === "user") navLinks.push({ name: "My Bookings", path: "/bookings" });
  if (user?.role === "admin") navLinks.push({ name: "Dashboard", path: "/admin" });

  // Logout handler
  const handleLogout = () => {
    if (onLogout) onLogout(); // call App.jsx logout
    navigate("/");            // redirect after logout
  };

  // Auth buttons
  const authLinks = user ? (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 rounded-full text-white font-semibold shadow-md transition-all duration-300 ${theme.button}`}
    >
      Logout
    </button>
  ) : (
    <>
      <Link
        to="/login"
        className={`text-white font-medium transition-colors duration-300 ${theme.hoverText}`}
      >
        Login
      </Link>
      <Link
        to="/register"
        className={`text-white font-medium transition-colors duration-300 ${theme.hoverText}`}
      >
        Register
      </Link>
    </>
  );

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/30 backdrop-blur-md border-b border-white/20 shadow-none"
          : "bg-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className={`text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-linear-to-r ${theme.gradient}`}
        >
          Priya Studio
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-white font-medium transition-colors duration-300 ${theme.hoverText}`}
            >
              {link.name}
            </Link>
          ))}
          {authLinks}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            className="text-white p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/60 backdrop-blur-md border-t border-white/20 shadow-xl flex flex-col items-center py-4 gap-4 transition-all duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-white font-medium transition-colors duration-300 ${theme.hoverText}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              className={`px-6 py-2 rounded-full text-white font-semibold shadow-md transition-all duration-300 ${theme.button}`}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-white font-medium transition-colors duration-300 ${theme.hoverText}`}
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`text-white font-medium transition-colors duration-300 ${theme.hoverText}`}
                onClick={() => setMobileOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
