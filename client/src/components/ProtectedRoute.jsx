// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function ProtectedRoute({ children }) {
  const { token, logout } = useAuth();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    const checkToken = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized");
        setIsValid(true);
      } catch {
        logout();
        setIsValid(false);
      }
    };

    checkToken();
  }, [token, logout]);

  if (isValid === null)
    return (
      <div className="text-center mt-10 text-gray-500 dark:text-gray-300">
        Verifierar inloggning...
      </div>
    );

  if (!isValid) return <Navigate to="/login" replace />;

  return children;
}
