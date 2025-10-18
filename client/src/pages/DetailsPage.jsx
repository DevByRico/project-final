import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../store/lib";

export default function DetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selected = location.state;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(selected?.service || "Fade");
  const [otherService, setOtherService] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!selected?.date || !selected?.time) {
    return (
      <div className="text-center mt-10 text-gray-300">
        <p>Please select a date and time first.</p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const chosenService =
        service === "Other" && otherService.trim() !== ""
          ? otherService
          : service;

      await api("/api/bookings", {
        method: "POST",
        body: {
          name,
          email,
          phone,
          date: selected.date,
          time: selected.time,
          service: chosenService,
        },
      });

      navigate("/confirmation", {
        state: { name, date: selected.date, time: selected.time, service: chosenService },
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="bg-slate-800/70 dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-md border border-slate-700">
        <h1 className="text-2xl font-bold mb-4 text-center text-white">Booking Details</h1>
        <p className="text-center text-gray-300 mb-6 text-sm">
          You’re booking <strong>{service}</strong> on{" "}
          <strong>{selected.date}</strong> at <strong>{selected.time}</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-300">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-slate-900 text-gray-100 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 outline-none transition"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-slate-900 text-gray-100 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-300">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg bg-slate-900 text-gray-100 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 outline-none transition"
              placeholder="+46 70 123 45 67"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-300">Service</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full rounded-lg bg-slate-900 text-gray-100 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 outline-none transition"
            >
              <option>Fade</option>
              <option>Fade + Beard</option>
              <option>Fade + Color</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {service === "Other" && (
            <div>
              <label className="block mb-1 font-medium text-gray-300">Describe your request</label>
              <textarea
                value={otherService}
                onChange={(e) => setOtherService(e.target.value)}
                rows="3"
                className="w-full rounded-lg bg-slate-900 text-gray-100 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 outline-none transition resize-none"
                placeholder="Write your custom service or notes here..."
                required
              />
            </div>
          )}

          {error && <p className="text-center text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl py-2.5 transition"
            disabled={loading}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
