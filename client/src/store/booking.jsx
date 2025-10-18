import React, { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [selectedBooking, setSelectedBooking] = useState(null);

  return (
    <BookingContext.Provider value={{ selectedBooking, setSelectedBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  return useContext(BookingContext);
}
