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
  discount,
  discountPercent,
  description = "",
  syllabus,
  teachers = [],
  enrollLink,
  categoryName,
  perks,
}) => {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart } = useCourseStore();

  /* ------------------ AUTH ------------------ */
  const token = useMemo(
    () => JSON.parse(localStorage.getItem("token"))?.state?.token,
    []
  );

  /* ------------------ CART MATCH (CRITICAL FIX) ------------------ */
  const isInCart = useMemo(
    () => cart.some((item) => String(item.id) === String(id)),
    [cart, id]
  );

  /* ------------------ DESCRIPTION ------------------ */
  const trimmedDescription = useMemo(() => {
    if (!description) return "";
    const words = description.trim().split(/\s+/);
    return words.length > MAX_DESC_WORDS
      ? words.slice(0, MAX_DESC_WORDS).join(" ") + "..."
      : description;
  }, [description]);

  /* ------------------ NAVIGATION ------------------ */
  const handleNavigate = useCallback(() => {
    navigate(`/courses/${id}`);
  }, [id, navigate]);

  /* ------------------ CART TOGGLE ------------------ */
  const handleCartToggle = useCallback(
    (e) => {
      e.stopPropagation();

      // 🔐 Auth guard
      if (!token) {
        toast.error("Please login to manage your cart");
        navigate("/login");
        return;
      }

      // 🗑 Remove if already in cart
      if (isInCart) {
        removeFromCart(id);
        toast.info("Removed from cart");
        return;
      }

      // 🛒 Add to cart (ZUSTAND-COMPATIBLE PAYLOAD)
      addToCart({
        id, // ✅ required
        examCategory: categoryName,
        courseDetails: batchName,
        img,

        // 💰 pricing (SAFE)
        actualprice: Number(price) || 0,
        previousprice: Number(price + (discount || 0)) || Number(price),
        amount: Number(discount) || 0,
        discountPercent: Number(discountPercent) || 0,
        enrollLink: enrollLink,
        // 📚 academic
        perks,
        insideCourses: syllabus,
      });

      toast.success("Added to cart");
    },
    [
      token,
      isInCart,
      id,
      categoryName,
      batchName,
      img,
      price,
      discount,
      discountPercent,
      perks,
      syllabus,
      addToCart,
      removeFromCart,
      navigate,
    ]
  );


  return (
    <div className="bg-white rounded-xl shadow-xl flex flex-col h-[600px] transition-transform hover:scale-[1.02]">
      {/* IMAGE */}
      <div className="relative h-52 md:h-60">
        <img
          src={img}
          alt={batchName}
          loading="lazy"
          className="w-full h-full object-cover rounded-2xl cursor-pointer"
          onClick={handleNavigate}
        />
        <div
          className="
    absolute left-1/2 -translate-x-1/2 -bottom-4
    w-[94%]
    bg-white
    px-4 py-2
    rounded-2xl
    shadow-xl
    flex items-center justify-between
    text-sm
  "
        >
          {/* DISCOUNT BADGE */}
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Discount
            </span>
            <div className="flex items-center gap-1 text-red-600 font-bold">
              <span className="text-xs">{discountPercent}%</span>
              <span className="text-xs uppercase">OFF</span>
            </div>
          </div>

          {/* PREVIOUS PRICE */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              MRP
            </span>
            <span className="text-sm text-gray-500 line-through font-medium">
              ₹{price}
            </span>
          </div>

          {/* FINAL PRICE */}
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Pay Now
            </span>
            <span className="text-base font-extrabold text-[var(--primary-color)] leading-none">
              ₹{discount}
            </span>
          </div>
        </div>



      </div>

      {/* CONTENT */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <h3 className="font-semibold mt-3 text-black text-md line-clamp-2 min-h-[44px]">
          {batchName}
        </h3>

        <p className="text-xs text-gray-500">Duration: {duration}</p>

        <p className="text-sm text-gray-600 min-h-[60px]">
          {trimmedDescription}
        </p>

        <ul className="text-sm text-gray-700 space-y-1 h-[70px] overflow-y-auto pr-1">
          {syllabus?.split("+").map((item, i) => (
            <li key={i} className="flex gap-2">
              <TiTickOutline className="text-green-600 mt-1" />
              <span>{item.trim()}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* FACULTY */}
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

      {/* ACTIONS */}
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
          onClick={handleNavigate}
          className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-2xl text-sm font-semibold hover:bg-opacity-90"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default React.memo(CoursesCard);
