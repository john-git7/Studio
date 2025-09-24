import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function AdminDashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  // Theme colors
  const statusColors = {
    pending: "#f6c23e",      // amber
    confirmed: "#4e73df",    // blue
    completed: "#1cc88a",    // green
    canceled: "#e74a3b",     // red
  };

  const statusPriority = {
    pending: 1,
    confirmed: 2,
    completed: 3,
    canceled: 4,
  };

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [user]);

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await apiRequest("/bookings", "GET", null, user.token);
      setBookings(res || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch bookings.");
    }
    setLoading(false);
  }

  async function updateStatus(id, status) {
    try {
      await apiRequest(`/bookings/${id}`, "PUT", { status }, user.token);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update booking status.");
    }
  }

  async function cancelBooking(id) {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await apiRequest(`/bookings/${id}`, "DELETE", null, user.token);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "canceled" } : b))
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // Filtered and sorted bookings
  const filteredBookings = bookings
    .filter((b) => {
      const name = b.userId?.name || b.clientName || "Unknown";
      const status = (b.status || "pending").toLowerCase();
      const matchesName = name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      return matchesName && matchesStatus;
    })
    .sort((a, b) => {
      const statusA = statusPriority[(a.status || "pending").toLowerCase()];
      const statusB = statusPriority[(b.status || "pending").toLowerCase()];
      if (statusA !== statusB) return statusA - statusB;

      const dateA = new Date(a.date || a.eventDate).getTime();
      const dateB = new Date(b.date || b.eventDate).getTime();
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

  if (!user) return <p style={{ textAlign: "center" }}>Please login as admin.</p>;
  if (loading) return <p style={{ textAlign: "center" }}>Loading bookings...</p>;
  if (bookings.length === 0) return <p style={{ textAlign: "center" }}>No bookings found.</p>;

  return (
    <div style={{ padding: "20px", background: "#f8f9fc", minHeight: "100vh" }}>
      <h1 style={{ color: "#4e73df", textAlign: "center", marginBottom: "25px" }}>ADMIN DASHBOARD</h1>

      {/* Filters */}
      <div style={{
        margin: "15px 0",
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
      }}>
        <input
          placeholder="Search by customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            border: "1px solid #d1d3e2",
            flex: "1",
            minWidth: "150px",
            background: "#fff",
            color: "#5a5c69",
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #d1d3e2", background: "#fff", color: "#5a5c69" }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #d1d3e2", background: "#fff", color: "#5a5c69" }}
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Booking Cards */}
      <div style={{ display: "grid", gap: "15px" }}>
        {filteredBookings.length === 0 && <p>No bookings match your filters.</p>}
        {filteredBookings.map((b) => {
          const status = (b.status || "pending").toLowerCase();
          return (
            <div key={b._id} style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}>
              <h3 style={{ color: "#4e73df", marginBottom: "10px" }}>{b.packageId?.name || b.eventName || "Unknown Package"}</h3>
              <p><b>Customer:</b> {b.userId?.name || b.clientName || "Unknown"} ({b.userId?.email || "N/A"})</p>
              <p><b>Date:</b> {b.date
                ? new Date(b.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                : b.eventDate
                ? new Date(b.eventDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                : "N/A"}
              </p>
              <p>
                <b>Status:</b>{" "}
                <span style={{
                  padding: "3px 10px",
                  borderRadius: "10px",
                  color: "#fff",
                  background: statusColors[status] || "#858796",
                  fontWeight: "500",
                  fontSize: "0.9rem",
                }}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </p>

              {/* Action Buttons */}
              <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {status === "pending" && (
                  <>
                    <button onClick={() => updateStatus(b._id, "confirmed")}
                      style={buttonStyle("#4e73df")}>Confirm</button>
                    <button onClick={() => updateStatus(b._id, "completed")}
                      style={buttonStyle("#1cc88a")}>Complete</button>
                    <button onClick={() => cancelBooking(b._id)}
                      style={buttonStyle("#e74a3b")}>Cancel</button>
                  </>
                )}
                {status === "confirmed" && (
                  <>
                    <button onClick={() => updateStatus(b._id, "completed")}
                      style={buttonStyle("#1cc88a")}>Complete</button>
                    <button onClick={() => cancelBooking(b._id)}
                      style={buttonStyle("#e74a3b")}>Cancel</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Button style
const buttonStyle = (bg) => ({
  flex: "0 1 auto",
  minWidth: "90px",
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  background: bg,
  color: "#fff",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: "500",
  transition: "background 0.2s",
});
