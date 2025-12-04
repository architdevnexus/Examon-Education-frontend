import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCourseStore } from "../../Zustand/GetAllCourses";

const CoursesSmallCard = ({
  image,
  courseName,
  actualPrice,
  previousPrice,
  discount,
  courseId,
}) => {
  const navigate = useNavigate();
  const { addToCart, removeFromCart, cart } = useCourseStore();
  const token = localStorage.getItem("token");

  const isInCart = useMemo(
    () => cart.some((item) => item.id === courseId),
    [cart, courseId]
  );

  const handleExplore = () => navigate(`/courses/${courseId}`);

  const handleCartToggle = () => {
    if (!token) {
      toast.warning("Please login first to add items to your cart.");
      navigate("/login");
      return;
    }

    if (isInCart) {
      removeFromCart(courseId);
      toast.info("Course removed from cart.");
    } else {
      addToCart({
        id: courseId,
        img: image,
        courseDetails: courseName,
        actualprice: actualPrice,
        previousprice: previousPrice,
        discount,
      });
      toast.success("Course added to cart!");
    }
  };

  return (
    <div
      className="
        flex flex-col bg-white rounded-2xl shadow-md hover:shadow-xl 
        transition-all duration-300 overflow-hidden
        h-[350px] max-h-[420px]      /* 📌 FIXED SAME HEIGHT */
      "
    >
      {/* IMAGE */}
      <div className="relative w-full h-40 min-h-[160px] max-h-[160px]">
        <img
          src={image}
          alt={courseName}
          className="w-full h-full object-cover"
        />

        {discount && (
          <span className="absolute top-2 right-2 bg-[#F11A28] text-white text-xs font-semibold px-2 py-1 rounded-md">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-grow p-4">

        {/* Course Title with fixed height */}
        <h3
          className="text-black text-base sm:text-lg font-semibold 
          line-clamp-2 min-h-[48px]"
          title={courseName}
        >
          {courseName}
        </h3>

        {/* Pricing */}
        <div className="flex items-center justify-between mt-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-black font-bold text-lg sm:text-xl">
              ₹{actualPrice}
            </span>

            {previousPrice && (
              <span className="text-gray-500 line-through text-sm">
                ₹{previousPrice}
              </span>
            )}
          </div>
        </div>

        {/* BUTTONS - FIXED HEIGHT AREA */}
        <div className="mt-auto flex items-center gap-2 pt-4 h-[48px]">
          <button
            onClick={handleExplore}
            className="bg-[var(--primary-color)] text-white px-4 py-2 
                       rounded-lg font-semibold transition w-1/2 
                       text-sm sm:text-base"
          >
            Explore
          </button>

          <button
            onClick={handleCartToggle}
            className={`
              flex items-center justify-center gap-2 px-2 py-2 
              rounded-lg font-semibold text-sm transition w-1/2
              ${
                isInCart
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
