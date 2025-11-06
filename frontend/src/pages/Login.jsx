import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    try {
      const res = await apiRequest("/auth/login", "POST", { email, password });
      if (res.error) return alert(res.error);

      const userData = { ...res.user, token: res.token };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      navigate(userData.role === "admin" ? "/admin" : "/");
    } catch (err) {
      alert(err.message);
    }
  }

  const isAdminLogin = email.toLowerCase().includes("@admin");
  const theme = isAdminLogin
    ? { gradient: "from-indigo-500 via-purple-500 to-pink-500", button: "bg-indigo-600 hover:bg-indigo-700" }
    : { gradient: "from-teal-400 via-cyan-500 to-blue-500", button: "bg-teal-600 hover:bg-teal-700" };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 w-80 flex flex-col gap-6">
        <h2 className={`text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r ${theme.gradient} text-center`}>
          {isAdminLogin ? "Admin Login" : "User Login"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/5 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/5 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className={`w-full py-2 rounded-full font-semibold text-white shadow-md transition-all duration-300 ${theme.button}`}
        >
          Login
        </button>
      </div>
    </div>
  );
}
