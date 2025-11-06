import { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function AdminDashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  const statusColors = {
    pending: "bg-amber-400",
    confirmed: "bg-blue-500",
    completed: "bg-emerald-500",
    canceled: "bg-red-500",
  };

  const statusPriority = { pending: 1, confirmed: 2, completed: 3, canceled: 4 };

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

  if (!user) return <p className="text-center mt-10 text-gray-500">Please login as admin.</p>;
  if (loading) return <p className="text-center mt-10 text-gray-500 animate-pulse">Loading bookings...</p>;
  if (bookings.length === 0) return <p className="text-center mt-10 text-gray-500">No bookings found.</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-12 pt-16 md:pt-20">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500">
        ADMIN DASHBOARD
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <input
          type="text"
          placeholder="Search by customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Booking Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBookings.length === 0 && <p className="text-center text-gray-400">No bookings match your filters.</p>}
        {filteredBookings.map((b) => {
          const status = (b.status || "pending").toLowerCase();
          return (
            <div
              key={b._id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-indigo-400 mb-2">{b.packageId?.name || b.eventName || "Unknown Package"}</h3>
              <p className="text-gray-300 mb-1">
                <span className="font-semibold">Customer:</span> {b.userId?.name || b.clientName || "Unknown"} ({b.userId?.email || "N/A"})
              </p>
              <p className="text-gray-300 mb-1">
                <span className="font-semibold">Date:</span>{" "}
                {b.date
                  ? new Date(b.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                  : b.eventDate
                  ? new Date(b.eventDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                  : "N/A"}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Status:</span>{" "}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || "bg-gray-500"}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                {status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(b._id, "confirmed")}
                      className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(b._id, "completed")}
                      className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => cancelBooking(b._id)}
                      className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {status === "confirmed" && (
                  <>
                    <button
                      onClick={() => updateStatus(b._id, "completed")}
                      className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => cancelBooking(b._id)}
                      className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                    >
                      Cancel
                    </button>
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
