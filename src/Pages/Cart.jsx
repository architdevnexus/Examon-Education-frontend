import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { useCourseStore } from "../Zustand/GetAllCourses";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCourseStore();

  /* ------------------ PRICE CALCULATIONS ------------------ */
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [cart]
  );

  const discountPercent = useMemo(() => {
    if (cart.length >= 3) return 20;
    if (cart.length === 2) return 15;
    if (cart.length === 1) return 10;
    return 0;
  }, [cart.length]);

  const discountAmount = useMemo(
    () => (subtotal * discountPercent) / 100,
    [subtotal, discountPercent]
  );

  const totalAmount = useMemo(
    () => subtotal - discountAmount,
    [subtotal, discountAmount]
  );

  /* ------------------ CHECKOUT ------------------ */
  const handleCheckout = () => {
    const token = JSON.parse(localStorage.getItem("token"))?.state?.token;
    if (!token) navigate("/login");
    else window.open("https://classplusapp.com/", "_blank");
  };

  /* ------------------ EMPTY STATE ------------------ */
  if (cart.length === 0) {
    return (
      <motion.div
        className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <img
          src="https://toppng.com/show_download/182968/sign-in-empty-cart-ico"
          alt="Empty Cart"
          className="w-60 mb-6 opacity-80"
        />
        <h2 className="text-3xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Explore our courses and add your favorite batch to start learning.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/courses")}
          className="mt-8 bg-[var(--primary-color)] text-white px-8 py-3 rounded-full font-semibold shadow-lg"
        >
          Explore Courses
        </motion.button>
      </motion.div>
    );
  }

  /* ------------------ CART ------------------ */
  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-10 px-4 md:px-10 lg:px-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-sm font-bold text-gray-800 mb-8">
        Your Cart ({cart.length})
      </h1>

      <div className="flex flex-col lg:flex-row  gap-8">
        {/* ---------------- CART ITEMS ---------------- */}
        <div className="flex-1 max-h-96 h-full overflow-scroll space-y-6">
          <AnimatePresence>
            {cart.map((item) => {
              const courseId = item._id || item.id;
              const image = item.image || item.images?.[0] || "";
              const title = item.batchName || item.title || "Course";
              const price = Number(item.price || 0);

              return (
                <motion.div
                  key={courseId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-md p-5 flex flex-col sm:flex-row gap-5"
                >
                  {/* Image */}
                  <img
                    src={image}
                    alt={title}
                    className="w-full sm:w-44 h-28 object-cover rounded-xl"
                  />

                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {title}
                    </h3>

                    {item.duration && (
                      <p className="text-sm text-gray-500">
                        Duration: {item.duration}
                      </p>
                    )}

                    {item.perks && (
                      <p className="text-sm text-gray-600">
                        <strong>Perks:</strong> {item.perks}
                      </p>
                    )}

                    {item.teachers?.length > 0 && (
                      <p className="text-sm text-gray-600">
                        <strong>Faculty:</strong>{" "}
                        {item.teachers.join(", ")}
                      </p>
                    )}

                    <span className="text-2xl font-bold text-gray-900 block mt-2">
                      ₹{price}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(courseId)}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 self-end sm:self-center"
                  >
                    <FiTrash2 /> Remove
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ---------------- SUMMARY ---------------- */}
        <div className="lg:w-[360px]">
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount ({discountPercent}%)</span>
                <span>- ₹{discountAmount.toFixed(2)}</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              * Final discount will be applied on Classplus checkout
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCheckout}
              className="mt-6 w-full bg-[var(--primary-color)] text-white py-3 rounded-full font-semibold shadow-md"
            >
              Proceed to Checkout
            </motion.button>

            <button
              onClick={() => navigate("/courses")}
              className="mt-3 w-full border border-[var(--primary-color)] text-[var(--primary-color)] py-3 rounded-full font-semibold hover:bg-[var(--tertiary-color)] transition"
            >
              Continue Exploring
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(Cart);
