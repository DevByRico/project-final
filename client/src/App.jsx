import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SelectTime from "./pages/SelectTime";
import DetailsPage from "./pages/DetailsPage";
import Confirmation from "./pages/ConfirmationPage";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter
      basename="/"
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Header />
      <Routes>
        <Route path="/" element={<SelectTime />} />
        <Route path="/details" element={<DetailsPage />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<p className="p-4">Not found.</p>} />
      </Routes>
    </BrowserRouter>
  );
}
