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
  actualprice,
  previousprice,
  percent,
  courseDetails,
  insideCourses = [],
  perks = [],
  Discount,
  amount,
}) => {

  const { cart, addToCart, removeFromCart } = useCourseStore();
  const navigate = useNavigate();

  const token = localStorage.getItem("token")

  // Check if this course is already in the cart
  const isInCart = cart.some((item) => item.id === id);

  /**  Toggle Cart Handler */
  const handleCartToggle = (e) => {
    e.stopPropagation(); // Prevent triggering Explore navigation

    if (!token) {
      toast.error("Please login to manage your cart");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (isInCart) {
      removeFromCart(id);
      toast.info("Removed from cart");
    } else {
      const courseData = {
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
      };
      addToCart(courseData);
      toast.success("Added to cart");
    }
  };

  /**  Navigate to Course Detail Page */
  const handleNavigate = () => navigate(`/courses/${id}`);

  return (
    <div
      className="rounded-xl bg-white flex flex-col flex-1 max-h-[600px]  shadow-xl overflow-hidden transition-transform hover:scale-[1.02] duration-300"
   
   >
      {/* === TOP SECTION (Image + Pricing) === */}
      <div className="relative shadow-lg p-2 rounded-2xl w-full h-52 md:h-62 overflow-hidden">
        <img
          src={img}
          alt={courseDetails}
          className="object-center object-cover rounded-2xl w-full "
          onClick={handleNavigate}
        />

        {/* === Pricing Overlay === */}
        <div className="absolute bottom-0 left-0 w-full bg-white px-4 py-1 flex justify-around items-center text-sm md:text-lg">
          <span className="font-bold text-black">₹{actualprice}</span>
          <span className="line-through text-gray-400">₹{previousprice}</span>
          <span className="text-red-500 font-medium">{percent}% OFF</span>
        </div>
      </div>

      {/* === SCROLLABLE COURSE DETAILS === */}
      <div className="flex flex-col gap-2 px-4 py-3 overflow-y-auto max-h-[calc(500px-14rem)] md:max-h-[calc(520px-14rem)]">
        <span className="font-semibold text-black text-md">
          {courseDetails}
        </span>

        {/* Inside Courses List */}
        <ul className="text-sm text-gray-600 space-y-1 min-h-28 overflow-y-auto pr-1">
          {insideCourses.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <TiTickOutline className="text-green-600 mt-1" />
              <span>{item}</span>
            </li>
          ))}
        </ul>


      </div>
      <div className="p-3">

        {/* Perks */}
        <div className="flex flex-wrap gap-2 mt-2">
          {perks.map((perk, i) => (
            <div
              key={i}
              className={`px-3 py-1 rounded-md text-white text-xs font-medium ${perk.toLowerCase() === "new"
                ? "bg-[#FF0000]"
                : "bg-[var(--text-color)]"
                }`}
            >
              {perk}
            </div>
          ))}
        </div>
        {/* Extra Discount */}
        {Discount && (
          <div className="flex items-center gap-2 text-sm text-[#FF0000] font-medium mt-2">
            <CiPercent className="text-xl" />
            <span>EXTRA ₹{amount} COUPON DISCOUNT</span>
          </div>
        )}
      </div>

      {/* === FIXED BOTTOM ACTIONS === */}
      <div
        onClick={handleNavigate}
        className="px-4 py-3 mt-auto flex items-center justify-between bg-white border-t"
      >
        {/* Heart Icon - Add/Remove from Cart */}
        <div
          onClick={handleCartToggle}
          className="p-2 text-lg rounded-full text-white bg-black hover:scale-110 transition-transform cursor-pointer"
        >
          {isInCart ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-white" />
          )}
        </div>

        {/* Explore Button */}
        <button
          className="px-6 py-2 rounded-2xl text-white bg-[var(--primary-color)] text-sm font-semibold cursor-pointer transition-all hover:bg-opacity-90"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default CoursesCard;
