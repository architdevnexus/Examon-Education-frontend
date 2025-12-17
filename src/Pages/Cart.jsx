import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { useCourseStore } from "../Zustand/GetAllCourses";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCourseStore();

  const totalAmount = useMemo(
    () => cart.reduce((sum, item) => sum + (item.actualprice || 0), 0),
    [cart]
  );

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
          src="/empty-cart.svg"
          alt="Empty Cart"
          className="w-60 mb-6 opacity-80"
        />
        <h2 className="text-3xl font-bold text-gray-800">
          Your cart is empty
        </h2>
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

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ---------------- CART ITEMS ---------------- */}
        <div className="flex-1 space-y-6">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-md p-5 flex flex-col sm:flex-row gap-5"
              >
                {/* Image */}
                <img
                  src={item?.img || item.image}
                  alt={item.title}
                  className="w-full sm:w-44 h-28 object-cover rounded-xl"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.courseDetails || item.title}
                  </h3>

                  {item.percent && (
                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {item.percent}% OFF
                    </span>
                  )}

                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{item.actualprice}
                    </span>

                    {item.previousprice && (
                      <span className="text-gray-400 line-through text-sm">
                        ₹{item.previousprice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="flex items-center gap-2 text-sm cursor-pointer text-red-500 hover:text-red-600 self-end sm:self-center"
                >
                  <FiTrash2 /> Remove
                </button>
              </motion.div>
            ))}
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
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>₹0.00</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

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
