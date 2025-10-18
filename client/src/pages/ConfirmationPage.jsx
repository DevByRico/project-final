import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function ConfirmationPage() {
  const location = useLocation();
  const { name, date, time, service } = location.state || {};

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="card w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Booking Confirmed 🎉</h1>

        {name ? (
          <>
            <p className="mb-2">Thank you, <strong>{name}</strong>!</p>
            <p className="mb-2">
              Your <strong>{service}</strong> appointment is confirmed for{" "}
              <strong>{date}</strong> at <strong>{time}</strong>.
            </p>
            <p className="muted mb-6">
              A confirmation email has been sent to you.
            </p>
            <Link to="/" className="btn w-full">
              Back to Home
            </Link>
          </>
        ) : (
          <>
            <p className="mb-4">
              Your booking was successful. Thank you!
            </p>
            <Link to="/" className="btn w-full">
              Back to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
