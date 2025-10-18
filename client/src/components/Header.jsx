import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../store/auth";

export default function Header() {
  const { token, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <Link
        to="/"
        className="flex items-center space-x-2 text-xl font-semibold hover:text-blue-600 transition text-gray-900 dark:text-white whitespace-nowrap"
      >
        <img
          src="/logo.png"
          alt="Best Barber Logo"
          className="w-8 h-8 rounded-full"
        />
        <span>Best Barber Booking</span>
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {token ? (
          <>
            <Link
              to="/admin"
              className="text-sm font-medium hover:text-blue-500 dark:hover:text-blue-400 transition text-gray-900 dark:text-gray-100"
            >
              Admin Panel
            </Link>
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:text-red-400 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="text-sm font-medium hover:text-blue-500 dark:hover:text-blue-400 transition text-gray-900 dark:text-gray-100"
          >
            Admin
          </Link>
        )}
      </div>
    </header>
  );
}
