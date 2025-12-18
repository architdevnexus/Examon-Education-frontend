import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCourseStore } from "../../Zustand/GetAllCourses";

const CoursesSmallCard = ({ batch }) => {
  const navigate = useNavigate();
  const { addToCart, removeFromCart, cart } = useCourseStore();
  const token = localStorage.getItem("token");

  const {
    _id,
    batchName,
    price,
    images,
    categoryName,
    duration,
    perks,
  } = batch;

  const isInCart = useMemo(
    () => cart.some((item) => item.id === _id),
    [cart, _id]
  );

  const handleExplore = () => navigate(`/courses/${_id}`);

  const handleCartToggle = () => {
    if (!token) {
      toast.warning("Please login first to add items to your cart.");
      navigate("/login");
      return;
    }

    if (isInCart) {
      removeFromCart(_id);
      toast.info("Course removed from cart.");
    } else {
      addToCart({
        id: _id,
        img: images?.[0],
        courseDetails: batchName,
        actualprice: price,
      });
      toast.success("Course added to cart!");
    }
  };

  return (
    <div
      className="
        flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl 
        transition-all duration-300 overflow-hidden
        h-[360px]
      "
    >
      {/* IMAGE */}
      <div className="relative w-full h-40">
        <img
          src={images?.[1]}
          alt={batchName}
          className="w-full h-full object-cover"
        />

        {categoryName && (
          <span className="absolute top-2 right-2 bg-[#F11A28] text-white text-xs font-semibold px-2 py-1 rounded-md">
            {categoryName.toUpperCase()}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-grow p-4">
        {/* Title */}
        <h3
          className="text-black text-base sm:text-lg font-semibold 
          line-clamp-2 min-h-[48px]"
          title={batchName}
        >
          {batchName}
        </h3>

        {/* Meta Info */}
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
          {perks} • {duration}
        </p>

        {/* Pricing */}
        <div className="mt-3 mb-2">
          <span className="text-black font-bold text-lg sm:text-xl">
            ₹{price}
          </span>
        </div>

        {/* BUTTONS */}
        <div className="mt-auto flex items-center gap-2 pt-4 h-[48px]">
          <button
            onClick={handleExplore}
            className="bg-[var(--primary-color)] text-white px-4 py-2 
                       rounded-lg font-semibold transition w-1/2"
          >
            Explore
          </button>

          <button
            onClick={handleCartToggle}
            className={`
              flex items-center justify-center gap-2 px-2 py-2 
              rounded-lg font-semibold transition w-1/2
              ${isInCart
                ? "bg-red-500 text-white hover:bg-red-600"
                : "border border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--tertiary-color)]"
              }
            `}
          >
            {isInCart ? (
              <>
                <FaTrashAlt size={14} /> Remove
              </>
            ) : (
              <>
                <FaShoppingCart size={14} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursesSmallCard;
