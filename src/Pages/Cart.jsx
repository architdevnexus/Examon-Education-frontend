import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { useCourseStore } from "../Zustand/GetAllCourses";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCourseStore();

  /* ------------------ PRICE ENGINE ------------------ */
  const calculatePrice = useCallback((item) => {
    const previous = Number(item.price || item.previousprice || 0);
    const final = Number(item.discount || previous);
    const saving = Math.max(previous - final, 0);

    return { previous, final, saving };
  }, []);

  /* ------------------ TOTALS ------------------ */
  const { subtotal, totalDiscount, totalAmount } = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalAmount = 0;

    cart.forEach((item) => {
      const { previous, final, saving } = calculatePrice(item);
      subtotal += previous;
      totalDiscount += saving;
      totalAmount += final;
    });

    return { subtotal, totalDiscount, totalAmount };
  }, [cart, calculatePrice]);

  /* ------------------ CHECKOUT ------------------ */
  const handleCheckout = useCallback(() => {
    const token = JSON.parse(localStorage.getItem("token"))?.state?.token;
    if (!token) navigate("/login");
    else window.open("https://classplusapp.com/", "_blank");
  }, [navigate]);

  /* ------------------ EMPTY CART ------------------ */
  if (!cart.length) {
    return (
      <motion.div
        className="min-h-[80vh]  flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <img
          src="https://toppng.com/show_download/182968/sign-in-empty-cart-ico"
          alt="Empty Cart"
          className="w-60 mb-6 opacity-80"
        />

        <h2 className="text-3xl font-bold text-gray-800">
          Your cart is empty
        </h2>

        <p className="text-gray-500 mt-2 max-w-md">
          Add courses to unlock amazing discounts and start learning 🚀
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/courses")}
          className="mt-8 bg-[var(--primary-color)] text-white px-8 py-3 rounded-full font-semibold shadow-lg"
        >
          Explore Courses
        </motion.button>
      </motion.div>
    );
  }

  /* ------------------ CART UI ------------------ */
  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-10 px-4 md:px-10 lg:px-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Your Cart ({cart.length})
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* ---------------- CART ITEMS ---------------- */}
        <div className="flex-1 space-y-6 max-h-[60vh] overflow-scroll pr-1">
          <AnimatePresence>
            {cart.map((item) => {
              const id = item.id || item._id;
              const image =
                item.image || item.img || item.images?.[0] || "";
              const title =
                item.title ||
                item.courseDetails ||
                item.batchName ||
                "Course";

              const { previous, final, saving } = calculatePrice(item);

              return (
                <motion.div
                  key={id}
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

                    {/* Price */}
                    <div className="mt-2 space-y-1">
                      {saving > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="line-through text-gray-400">
                            ₹{previous}
                          </span>

                          {item.discountPercent > 0 && (
                            <span className="text-red-500 font-semibold">
                              {item.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      )}

                      <span className="text-2xl font-bold text-gray-900">
                        ₹{final}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(id)}
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
        <div className="lg:w-[360px] h-[50vh] mb-4 sm:mb-0">
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
                <span>Subtotal (MRP)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Total Savings</span>
                <span>- ₹{totalDiscount.toFixed(2)}</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Payable Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              * Final payment will be processed on Classplus
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
