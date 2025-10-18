import React, { useEffect, useState } from "react";
import { api } from "../store/lib";
import { useAuth } from "../store/auth";
import { CheckCircle, Clock, Trash2, User, Search } from "lucide-react";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const data = await api("/api/bookings", { token });
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(id) {
    await api(`/api/bookings/${id}/toggle`, { method: "PATCH", token });
    loadBookings();
  }

  async function deleteBooking(id) {
    if (!confirm("Delete this booking?")) return;
    await api(`/api/bookings/${id}`, { method: "DELETE", token });
    loadBookings();
  }

  const filtered = bookings
    .filter((b) => (filter === "all" ? true : b.status === filter))
    .filter((b) => {
      const q = search.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.service.toLowerCase().includes(q) ||
        b.date.toLowerCase().includes(q)
      );
    });

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading bookings...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Admin Dashboard</h1>

      {/* Search bar */}
      <div className="flex items-center justify-center mb-6 relative w-full sm:w-[60%] mx-auto">
        <Search
          size={18}
          className="absolute left-3 text-gray-400 dark:text-slate-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, date or service..."
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter buttons */}
      <div className="flex justify-center gap-3 mb-6">
        {["all", "done"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-100"
            }`}
          >
            {type === "all" ? "All" : "Done"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid gap-4">
          {filtered.map((b) => (
            <div
              key={b._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition hover:shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span className="font-semibold">{b.name}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {b.service} — {b.date} at {b.time}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {b.email} • {b.phone}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                <button
                  onClick={() => toggleStatus(b._id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    b.status === "done"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }`}
                >
                  {b.status === "done" ? (
                    <>
                      <CheckCircle size={16} /> Done
                    </>
                  ) : (
                    <>
                      <Clock size={16} /> Booked
                    </>
                  )}
                </button>

                <button
                  onClick={() => deleteBooking(b._id)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
