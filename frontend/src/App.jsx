import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import PackageDetails from "./pages/PackageDetails";
import MyBookings from "./pages/MyBookings";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <Router>
      <Navbar user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard user={user} />} />
        <Route path="/package/:id" element={<PackageDetails user={user} />} />
        <Route path="/bookings" element={<MyBookings user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
