import React from "react";
import { TiTickOutline } from "react-icons/ti";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { CiPercent } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCourseStore } from "../../Zustand/GetAllCourses";

const CoursesCard = ({
  id,
  img,
  duration,
  actualprice,
  previousprice,
  percent,
  courseDetails,
  insideCourses = [],
  perks = [],
  Discount,
  amount,
}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { cart, addToCart, removeFromCart } = useCourseStore();
  const isInCart = cart.some((item) => item.id === id);

  /** Toggle Cart Button */
  const handleCartToggle = (e) => {
    e.stopPropagation();

    if (!token) {
      toast.error("Please login to manage your cart");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    if (isInCart) {
      removeFromCart(id);
      toast.info("Removed from cart");
    } else {
      addToCart({
        id,
        img,
        actualprice,
        previousprice,
        percent,
        courseDetails,
        insideCourses,
        perks,
        Discount,
        amount,
      });
      toast.success("Added to cart");
    }
  };

  /** Navigate to single course */
  const handleNavigate = () => navigate(`/courses/${id}`);

  return (
    <div
      className="
        bg-white rounded-xl shadow-xl overflow-hidden 
        flex flex-col transition-transform hover:scale-[1.02] duration-300
        h-[600px] max-h-[600px]
      "
    >
      {/* ==== IMAGE SECTION ==== */}
      <div className="relative p-2 rounded-2xl w-full shadow-2xl h-52 md:h-60 overflow-hidden">
        <img
          src={img}
          alt={courseDetails}
          className="w-full h-full object-cover rounded-2xl cursor-pointer"
          onClick={handleNavigate}
        />

        {/* ==== PRICE BANNER ==== */}
        <div className="absolute bottom-0 left-0 w-full bg-white px-4 py-1 flex justify-between items-center text-sm">
          <span className="font-bold text-black">₹{actualprice}</span>
          <span className="line-through text-gray-400">₹{previousprice}</span>
          <span className="text-red-500 font-semibold">{percent}% OFF</span>
        </div>
      </div>

      {/* ==== TITLE + MODULES ==== */}
      <div className="px-4 py-3 flex flex-col gap-2">
        {/* Title */}
        <span className="font-semibold text-black text-md line-clamp-2 h-[48px]">
          {courseDetails} - <span className="font-semibold text-black text-xs line-clamp-2 h-[48px]">
          {duration}
        </span>
        </span>
       

        {/* Inside Modules */}
        <ul className="text-sm text-gray-600 space-y-1 h-[110px] overflow-y-auto pr-1">
          {insideCourses.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <TiTickOutline className="text-green-600 mt-1" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ==== PERKS & DISCOUNT ==== */}
      <div className="px-4">
        <div className="flex flex-wrap gap-2 mt-1">
          {perks.map((perk, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-md text-white text-xs font-medium ${
                perk.toLowerCase() === "new"
                  ? "bg-red-600"
                  : "bg-[var(--text-color)]"
              }`}
            >
              {perk}
            </span>
          ))}
        </div>

        {Discount && (
          <div className="flex items-center gap-2 text-sm text-red-600 font-medium mt-2">
            <CiPercent className="text-xl" />
            <span>EXTRA ₹{amount} COUPON DISCOUNT</span>
          </div>
        )}
      </div>

      {/* ==== BOTTOM ACTIONS ==== */}
      <div
        onClick={handleNavigate}
        className="mt-auto px-4 py-3 flex items-center justify-between bg-white border-t cursor-pointer"
      >
        {/* Heart Button */}
        <div
          onClick={handleCartToggle}
          className="p-2 rounded-full bg-black hover:scale-110 transition-transform"
        >
          {isInCart ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-white text-lg" />
          )}
        </div>

        <button className="px-6 py-2 bg-[var(--primary-color)] cursor-pointer text-white rounded-2xl font-semibold text-sm hover:bg-opacity-90">
          Explore
        </button>
      </div>
    </div>
  );
};

export default CoursesCard;
