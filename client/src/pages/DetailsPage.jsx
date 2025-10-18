import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../store/lib";

export default function DetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selected = location.state; // date, time, service

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(selected?.service || "Fade");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!selected?.date || !selected?.time) {
    return (
      <div className="text-center mt-10">
        <p>Please select a date and time first.</p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api("/api/bookings", {
        method: "POST",
        body: {
          name,
          email,
          phone,
          date: selected.date,
          time: selected.time,
          service,
        },
      });

      navigate("/confirmation", { state: { name, date: selected.date, time: selected.time, service } });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Booking Details</h1>
        <p className="muted text-center mb-6">
          You’re booking <strong>{service}</strong> on{" "}
          <strong>{selected.date}</strong> at <strong>{selected.time}</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input"
              placeholder="+46 70 123 45 67"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Service</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="input"
            >
              <option>Fade</option>
              <option>Fade + Beard</option>
              <option>Fade + Color</option>
            </select>
          </div>

          {error && (
            <p className="text-center text-red-500 text-sm">{error}</p>
          )}

          <button type="submit" className="btn w-full" disabled={loading}>
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
