import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// dina providers
import { AuthProvider } from "./store/auth";
import { BookingProvider } from "./store/booking";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BookingProvider>
        <App />
      </BookingProvider>
    </AuthProvider>
  </React.StrictMode>
);
