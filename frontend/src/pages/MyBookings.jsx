import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusColors = {
    pending: "#f0ad4e",
    confirmed: "#007bff",
    completed: "#28a745",
    canceled: "#dc3545",
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
      const res = await apiRequest("/bookings/my", "GET", null, user.token);
      const sorted = (res || []).sort((a, b) => {
        // Status priority first
        const statusA = statusPriority[(a.status || "confirmed").toLowerCase()];
        const statusB = statusPriority[(b.status || "confirmed").toLowerCase()];
        if (statusA !== statusB) return statusA - statusB;

        // Then by date: latest first
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
      setBookings(sorted);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch your bookings.");
    }
    setLoading(false);
  }

  async function cancelBooking(id) {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await apiRequest(`/bookings/${id}`, "DELETE", null, user.token);
      if (res.error) {
        alert(res.error);
      } else {
        alert("Booking cancelled.");
        fetchBookings();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking.");
    }
  }

  function formatDate(dateStr) {
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  if (!user) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Please login to view your bookings.</p>;
  }

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading your bookings...</p>;
  }

  if (bookings.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>You have no bookings yet.</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "25px" }}>📅 My Bookings</h2>
      <div style={{ display: "grid", gap: "20px" }}>
        {bookings.map((b) => {
          const status = (b.status || "confirmed").toLowerCase();
          return (
            <div key={b._id} style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              <h3 style={{ color: "#800080", marginBottom: "10px" }}>{b.packageId?.name || b.eventName || "Unknown Package"}</h3>
              <p style={{ marginBottom: "6px", color: "#555" }}><strong>Date:</strong> {formatDate(b.date)}</p>
              <p style={{ marginBottom: "6px", color: "#555" }}>
                <strong>Status:</strong>{" "}
                <span style={{
                  padding: "2px 10px",
                  borderRadius: "8px",
                  color: "#fff",
                  background: statusColors[status] || "#6c757d",
                  fontWeight: "500",
                }}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </p>

              <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {status !== "canceled" && (
                  <button
                    style={{
                      flex: "0 1 auto",
                      minWidth: "80px",
                      background: "#e63946",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.background = "#d62839")}
                    onMouseLeave={(e) => (e.target.style.background = "#e63946")}
                    onClick={() => cancelBooking(b._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
