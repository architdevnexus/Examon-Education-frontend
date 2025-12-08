import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReminderPopup() {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);
  const navigate = useNavigate();

  const data = {
    id: 1,
    image:
      "https://i.pinimg.com/736x/44/54/d1/4454d14c16551699574affb88bad67cc.jpg",
    name: "UPSC",
    price: "5000",
    offer: "15",
    actualPrice: "10000",
    link: "/upsc",
  };

  /* -------------------- SHOW AFTER 5 SECONDS -------------------- */
  useEffect(() => {
    if (closed) return;
    const timer = setTimeout(() => setShow(true), 5000);

    return () => clearTimeout(timer);
  }, []);

  /* -------------------- SHOW ON X-SCROLL -------------------- */
  useEffect(() => {
    const handleScroll = () => {
      if (!closed && window.scrollX > 150) {
        setShow(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [closed]);

  const closePopup = () => {
    setShow(false);
    setClosed(true);
  };

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 bottom-4 z-50 
      w-full max-w-4xl px-4 transition-all duration-500
      ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
    >
      <div
        className="
          bg-(--tertiary-color) shadow-xl rounded-xl 
          p-4 flex items-center gap-4
          md:flex-row flex-col
        "
      >
        {/* Image */}
        <div className="w-28 h-20 rounded-lg overflow-hidden shadow-md shrink-0">
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1 w-full">
          <h2 className="text-lg font-semibold">{data.name} Study Kit</h2>

          <div className="flex gap-3 mt-1 items-center flex-wrap">
            <p className="text-xl font-bold text-black">₹{data.price}</p>
            <p className="line-through text-gray-500">₹{data.actualPrice}</p>
            <p className="text-green-600 font-medium">{data.offer}% Off</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center md:flex-row flex-row-reverse gap-3 mt-3 md:mt-0">
          <button
            onClick={() => navigate(data.link)}
            className="
              px-4 py-2 bg-(--primary-color) 
              text-white rounded-lg font-medium
              text-sm md:text-base
              active:scale-95 transition
            "
          >
            Explore
          </button>

          <button
            onClick={closePopup}
            className="
              text-white bg-red-600 px-3 py-1 rounded-full 
              text-lg active:scale-95 transition
            "
          >
            ✖
          </button>
        </div>
      </div>
    </div>
  );
}
