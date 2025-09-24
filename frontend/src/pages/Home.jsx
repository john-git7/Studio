import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { Link } from "react-router-dom";

export default function Home({ user }) {
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    apiRequest("/packages").then(setPackages);
  }, []);

  const categories = ["All", ...new Set(packages.map((p) => p.category))];

  const filtered = packages.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const grouped = filtered.reduce((acc, pkg) => {
    acc[pkg.category] = acc[pkg.category] || [];
    acc[pkg.category].push(pkg);
    return acc;
  }, {});

  // Determine theme based on user role
  const themeColors = user?.role === "admin" ? {
    primary: "#4e73df",
    button: "#4e73df",
    buttonHover: "#2e59d9",
    border: "#d1d3e2",
    text: "#333",
    subtitle: "#555"
  } : {
    primary: "#20c997",
    button: "#20c997",
    buttonHover: "#1aa179",
    border: "#c1eae1",
    text: "#333",
    subtitle: "#555"
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "2rem", color: themeColors.primary }}>
        📸 Priya Studio Packages
      </h2>

      {/* Search & Filter */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        marginBottom: "30px",
        flexWrap: "wrap"
      }}>
        <input
          type="text"
          placeholder="Search packages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "1rem",
            border: `1px solid ${themeColors.border}`,
            borderRadius: "8px",
            minWidth: "250px",
            outline: "none",
            transition: "border 0.2s",
          }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "1rem",
            border: `1px solid ${themeColors.border}`,
            borderRadius: "8px",
            outline: "none",
            transition: "border 0.2s",
          }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Package Grid */}
      {Object.entries(grouped).length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#666" }}>
          ❌ No packages found.
        </p>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} style={{ marginBottom: "40px" }}>
            <h3 style={{
              borderBottom: `3px solid ${themeColors.primary}`,
              paddingBottom: "8px",
              fontSize: "1.5rem",
              color: themeColors.text
            }}>
              {category}
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
              marginTop: "20px"
            }}>
              {items.map((p) => (
                <div
                  key={p._id}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                  }}
                >
                  <h4 style={{ fontSize: "1.2rem", marginBottom: "10px", color: themeColors.text }}>{p.name}</h4>
                  <p style={{ fontSize: "1rem", marginBottom: "15px", color: themeColors.subtitle }}>
                    <b>Price:</b> ₹{p.price}
                  </p>
                  <Link
                    to={`/package/${p._id}`}
                    style={{
                      display: "inline-block",
                      backgroundColor: themeColors.button,
                      color: "white",
                      padding: "10px 15px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeColors.buttonHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = themeColors.button}
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
