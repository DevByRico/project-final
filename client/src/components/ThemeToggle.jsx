// src/components/ThemeToggle.jsx
import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="text-2xl p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 transition"
      title={isDark ? "Byt till ljust läge" : "Byt till mörkt läge"}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
