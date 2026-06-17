"use client";
import { useState, useEffect } from "react";

export const useUnreadCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = () => {
      const val = localStorage.getItem("total_unread");
      setCount(val ? parseInt(val) : 0);
    };
    read(); // lecture initiale
    window.addEventListener("unread_updated", read);
    return () => window.removeEventListener("unread_updated", read);
  }, []);

  return count;
};
