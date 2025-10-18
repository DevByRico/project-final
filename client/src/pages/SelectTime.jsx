import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { useBooking } from "../store/booking";
import { api } from "../store/lib";

dayjs.locale("en");

const ALL_TIMES = [
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30"
];

export default function SelectTime() {
  const navigate = useNavigate();
  const { setSelectedBooking } = useBooking();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");

  const tz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    []
  );

  const dateString = useMemo(
    () => dayjs(selectedDate).format("YYYY-MM-DD"),
    [selectedDate]
  );

  // Disable past days
  const isDateDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  // Fetch available slots
  useEffect(() => {
    let ignore = false;
    async function loadSlots() {
      setLoadingSlots(true);
      setError("");
      setSelectedTime("");
      try {
        const res = await api(`/api/slots?date=${dateString}`);
        if (!ignore) setAvailableTimes(res?.available || []);
      } catch (e) {
        if (!ignore) {
          setAvailableTimes([]);
          setError(e.message || "Failed to load available times.");
        }
      } finally {
        if (!ignore) setLoadingSlots(false);
      }
    }
    loadSlots();
    return () => { ignore = true; };
  }, [dateString]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!selectedTime) return;
    setSelectedBooking({ date: dateString, time: selectedTime });
    navigate("/details", { state: { date: dateString, time: selectedTime } });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
      >
        {/* Left card */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="Best Barber logo" className="h-12 w-12 rounded-full" />
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-slate-400">
                BEST
              </div>
              <h2 className="text-xl font-semibold">Best Barber</h2>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Selected day</h3>
            <p className="text-sm">{dayjs(selectedDate).format("dddd D MMMM YYYY")}</p>
            <p className="muted text-sm">
              First choose a date and time. You’ll select the service on the next page.
            </p>
            {selectedTime && (
              <p className="text-sm">
                <span className="font-medium">Time:</span> {selectedTime}
              </p>
            )}
          </div>
        </div>

        {/* Right card */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="text-base font-semibold">
              {dayjs(selectedDate).format("MMMM")}{" "}
              <span className="text-gray-500 dark:text-slate-400">
                {dayjs(selectedDate).format("YYYY")}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-slate-400">
              Time zone: <span className="font-medium">{tz}</span>
            </div>
          </div>

          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileDisabled={isDateDisabled}
            locale="en"
            className="mb-4"
          />

          <div className="mt-2">
            <h4 className="font-semibold mb-2">Available times</h4>
            {loadingSlots && <p className="text-sm text-gray-500 dark:text-slate-400">Loading…</p>}
            {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

            {!loadingSlots && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ALL_TIMES.map((time) => {
                  const isAvailable = availableTimes.includes(time);
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => isAvailable && setSelectedTime(time)}
                      disabled={!isAvailable}
                      className={[
                        "rounded-lg border px-4 py-2 text-sm font-medium transition",
                        "disabled:opacity-40 disabled:cursor-not-allowed",
                        isSelected
                          ? "bg-blue-600 text-white border-transparent"
                          : "bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700",
                      ].join(" ")}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={[
              "btn w-full mt-6",
              !selectedTime ? "opacity-60 cursor-not-allowed" : "",
            ].join(" ")}
            disabled={!selectedTime}
          >
            Next
          </button>
        </div>
      </form>
    </section>
  );
}
