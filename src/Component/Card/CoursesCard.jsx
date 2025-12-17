import React, { useCallback, useMemo } from "react";
import { TiTickOutline } from "react-icons/ti";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCourseStore } from "../../Zustand/GetAllCourses";

const MAX_DESC_WORDS = 15;

const CoursesCard = ({
  id,
  img,
  batchName,
  duration,
  price,
  description = "",
  syllabus,
  teachers = [],
  enrollLink,
}) => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart } = useCourseStore();

  const token = useMemo(() => localStorage.getItem("token"), []);
  const isInCart = useMemo(() => cart.some(i => i.id === id), [cart, id]);

  /* ------------------ TRIM DESCRIPTION ------------------ */
  const trimmedDescription = useMemo(() => {
    const words = description.trim().split(/\s+/);
    return words.length > MAX_DESC_WORDS
      ? words.slice(0, MAX_DESC_WORDS).join(" ") + "..."
      : description;
  }, [description]);

  /* ------------------ HANDLERS ------------------ */
  const handleNavigate = useCallback(() => {
    navigate(`/courses/${id}`);
  }, [id, navigate]);

  const handleCartToggle = useCallback(
    (e) => {
      e.stopPropagation();

      if (!token) {
        toast.error("Please login to manage your cart");
        navigate("/login");
        return;
      }

      if (isInCart) {
        removeFromCart(id);
        toast.info("Removed from cart");
      } else {
        addToCart({ id, batchName, img, price });
        toast.success("Added to cart");
      }
    },
    [token, isInCart, id, batchName, img, price, addToCart, removeFromCart, navigate]
  );

  return (
    <div
      className="
        bg-white rounded-xl shadow-xl 
        flex flex-col h-[600px] 
        transition-transform hover:scale-[1.02]
      "
    >
      {/* ================= IMAGE ================= */}
      <div className="relative h-52 md:h-60">
        <img
          src={img}
          alt={batchName}
          loading="lazy"
          className="w-full h-full object-cover rounded-2xl cursor-pointer"
          onClick={handleNavigate}
        />
        <div className="absolute flex justify-between w-[98%] mx-auto left-1 -bottom-2 bg-white px-4 py-1 rounded-lg font-bold shadow">
          <span>Price: </span>
        <span >
          ₹{price} /only
        </span>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <h3 className="font-semibold text-black text-md line-clamp-2 min-h-[44px]">
          {batchName}
        </h3>

        <p className="text-xs text-gray-500">Duration: {duration}</p>

        {/* DESCRIPTION (fixed height) */}
        <p className="text-sm text-gray-600 min-h-[60px]">
          {trimmedDescription}
        </p>

        {/* SYLLABUS */}
        <ul className="text-sm text-gray-700 space-y-1 h-[70px] overflow-y-auto pr-1">
          {syllabus?.split("+").map((item, i) => (
            <li key={i} className="flex gap-2">
              <TiTickOutline className="text-green-600 mt-1" />
              <span>{item.trim()}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ================= FACULTY ================= */}
      <div className="px-4 mb-2">
        <p className="text-xs font-semibold text-gray-700 mb-1">Faculty</p>
        <div className="flex flex-wrap gap-2 max-h-[52px] overflow-hidden">
          {teachers.map((t, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-gray-100 text-xs rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div
        onClick={handleNavigate}
        className="mt-auto px-4 py-3 flex justify-between items-center border-t cursor-pointer"
      >
        <div
          onClick={handleCartToggle}
          className="p-2 bg-black rounded-full hover:scale-110 transition"
        >
          {isInCart ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-white text-lg" />
          )}
        </div>

        <button
          onClick={()=>navigate(id)}
          target="_blank"
          rel="noreferrer"
          className="px-6 py-2 cursor-pointer bg-[var(--primary-color)] text-white rounded-2xl text-sm font-semibold hover:bg-opacity-90"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default React.memo(CoursesCard);
