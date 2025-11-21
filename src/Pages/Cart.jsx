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
    if (!token) {
      navigate("/login");
    } else {
      window.open("https://classplusapp.com/", "_blank");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  // Empty cart UI
  if (cart.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-[80vh] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.img
          src="/empty-cart.svg"
          alt="Empty Cart"
          className="w-56 mb-4 opacity-80"
          loading="lazy"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        />
        <h2 className="text-2xl font-semibold text-gray-700">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mt-2">
          Looks like you haven’t added anything yet.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/courses")}
          className="mt-6 bg-[var(--primary-color)] text-white px-6 py-3 rounded-full font-medium shadow-md hover:brightness-95 transition"
        >
          Browse Courses
        </motion.button>
      </motion.div>
    );
  }
  console.log(cart);
  return (
    <motion.div
      className="min-h-screen mb-14 bg-gray-50 py-10 px-4 sm:px-8 md:px-12 lg:px-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >


      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <motion.div
          className="flex-1 bg-white rounded-2xl shadow-lg p-6 space-y-6"
          variants={containerVariants}
        >
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                exit="exit"
                layout
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border-b pb-6 last:border-none"
              >
                <motion.img
                  src={item?.img || item.image}
                  alt={item.courseDetails || item.title}
                  className="w-32 h-24 sm:w-40 sm:h-28 object-cover rounded-xl shadow-sm"
                  loading="lazy"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 100 }}
                />

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-gray-800 text-lg leading-snug">
                    {item.courseDetails || item.title}
                  </h3>
                  {item.percent && (
                    <p className="text-green-600 text-sm font-medium mt-1">
                      {item.percent}% OFF
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 justify-center sm:justify-start">
                    <span className="text-xl font-bold text-black">
                      ₹{item.actualprice}
                    </span>
                    {item.previousprice && (
                      <span className="text-gray-400 line-through text-sm">
                        ₹{item.previousprice ? item.previousprice : (
                          <div className=""
                            onClick={() => navigate("/courses")}
                          >Visit</div>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <motion.button
                  onClick={() => removeFromCart(item.id)}
                  whileHover={{ scale: 1.05, color: "#ef4444" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center cursor-pointer gap-2 text-red-500 hover:text-red-600 font-medium transition text-sm"
                >
                  <FiTrash2 className="text-lg" /> Remove
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Summary */}
        <motion.div
          className="lg:w-1/3 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Subtotal</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Discount</span>
            <span>₹0.00</span>
          </div>

          <div className="flex justify-between text-gray-800 font-semibold text-lg border-t pt-3 mt-3">
            <span>Total</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCheckout}
            className="mt-6 w-full bg-[var(--primary-color)] text-white py-3 rounded-full font-semibold shadow-md hover:brightness-95 transition"
          >
            Proceed to Checkout
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/courses")}
            className="mt-3 w-full border border-[var(--primary-color)] text-[var(--primary-color)] py-3 rounded-full font-semibold hover:bg-[var(--tertiary-color)] transition"
          >
            Continue Exploring
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default React.memo(Cart);
