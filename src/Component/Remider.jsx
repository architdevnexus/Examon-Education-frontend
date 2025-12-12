import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function ReminderPopup({ item }) {
  const [show, setShow] = useState(false);
  const [closedAt, setClosedAt] = useState(null);
  const navigate = useNavigate();

  // dynamic item (falls back to demo)
  const data = item || {
    name: "UPSC Master Course",
    images: [
      "https://i.pinimg.com/736x/44/54/d1/4454d14c16551699574affb88bad67cc.jpg",
    ],
    price: 4999,
    actualPrice: 9999,
    offer: 50,
    link: "/upsc",
  };

  /* ---------------- SHOW FIRST TIME AFTER 5s ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------- RE-SHOW AFTER CLOSE (15s) ---------------- */
  useEffect(() => {
    if (!closedAt) return;
    const timer = setTimeout(() => {
      setShow(true);
      setClosedAt(null);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------- SHOW ON SCROLL ---------------- */
  const handleScroll = useCallback(() => {
    if (!show && window.scrollY > 150) {
      setShow(true);
      window.removeEventListener("scroll", handleScroll);
    }
  }, [show]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- CLOSE ---------------- */
  const closePopup = () => {
    setShow(false);
    setClosedAt(Date.now());
  };

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 bottom-5 z-[9999] 
      w-[95%] max-w-xl transition-all duration-500
      ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
    `}
    >
      <div
        className="bg-white shadow-2xl rounded-2xl border border-gray-200 
        p-4 flex gap-4 items-center md:flex-row flex-col relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 
          text-xl font-bold"
        >
          ✕
        </button>

        {/* Image */}
        <div className="w-28 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <img
            src={data.images?.[0]}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Course Info */}
        <div className="flex-1 w-full">
          <h2 className="text-lg font-bold text-gray-900 leading-tight">
            {data.name}
          </h2>

          <div className="flex items-end gap-3 mt-2">
            <p className="text-2xl font-bold text-blue-600">
              ₹{data.price}
            </p>
            <p className="line-through text-gray-500 text-sm">
              ₹{data.actualPrice}
            </p>
            <span className="text-green-600 font-semibold text-sm">
              {data.offer}% OFF
            </span>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Limited Time Offer · Enroll Now
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate(data.link)}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 
          text-white rounded-lg font-semibold text-sm shadow-lg 
          active:scale-95 transition"
        >
          Explore Course
        </button>
      </div>
    </div>
  );
}
