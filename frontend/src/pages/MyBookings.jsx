import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const theme = {
    gradient: "from-teal-400 via-cyan-500 to-blue-500",
    button: "bg-teal-600 hover:bg-cyan-500",
    statusColors: {
      pending: "bg-yellow-400 text-black",
      confirmed: "bg-cyan-500 text-white",
      completed: "bg-teal-500 text-white",
      canceled: "bg-red-500 text-white",
    },
  };

  const statusPriority = { pending: 1, confirmed: 2, completed: 3, canceled: 4 };

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [user]);

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await apiRequest("/bookings/my", "GET", null, user.token);
      const sorted = (res || []).sort((a, b) => {
        const statusA = statusPriority[(a.status || "confirmed").toLowerCase()];
        const statusB = statusPriority[(b.status || "confirmed").toLowerCase()];
        if (statusA !== statusB) return statusA - statusB;
        return new Date(b.date) - new Date(a.date);
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
      await apiRequest(`/bookings/${id}`, "DELETE", null, user.token);
      alert("Booking canceled.");
      fetchBookings();
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

  if (!user)
    return <p className="text-center mt-16 text-gray-400">Please login to view your bookings.</p>;
  if (loading)
    return <p className="text-center mt-16 text-gray-400 animate-pulse">Loading your bookings...</p>;
  if (bookings.length === 0)
    return <p className="text-center mt-16 text-gray-400">You have no bookings yet.</p>;

  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => (b.status || "confirmed").toLowerCase() === filter);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 md:px-12 pt-16 md:pt-20">
      <h2
        className={`text-3xl md:text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-linear-to-r ${theme.gradient}`}
      >
        📅 My Bookings
      </h2>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 flex-wrap mb-8">
        {["all", "pending", "confirmed", "completed", "canceled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              filter === status
                ? "bg-white text-gray-900 shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBookings.map((b) => {
          const status = (b.status || "confirmed").toLowerCase();
          return (
            <div
              key={b._id}
              className="bg-white/10 rounded-2xl p-6 shadow-md transition-all duration-200"
            >
              <h3 className="text-xl font-semibold text-teal-400 mb-2">
                {b.packageId?.name || b.eventName || "Unknown Package"}
              </h3>
              <p className="text-gray-300 mb-1">
                <span className="font-semibold">Date:</span> {formatDate(b.date)}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    theme.statusColors[status] || "bg-gray-500"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </p>

              {status !== "canceled" && (
                <button
                  onClick={() => cancelBooking(b._id)}
                  className={`mt-3 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${theme.button}`}
                >
                  Cancel
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
