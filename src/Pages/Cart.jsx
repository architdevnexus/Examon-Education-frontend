import React, { memo, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";
import { useCourseStore } from "../Zustand/GetAllCourses";

/* ------------------ UTILS ------------------ */
const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN").format(value || 0);

const normalizeCourse = (item = {}) => {
  const previous = Number(item.saving || item.price || 0);
  const final = Number(item.discount || item.price || 0);

  return {
    id: item.id || item._id,
    title:
      item.title ||
      item.courseDetails ||
      item.batchName ||
      "Course",
    image:
      item.image ||
      item.img ||
      item.images?.[0] ||
      "/placeholder-course.jpg",
    previous,
    final,
    saving: Math.max(previous - final, 0),
    discountPercent: Number(item.discountPercent || 0),
    enrollLink: item.enrollLink,
  };
};

/* ------------------ COMPONENT ------------------ */
const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCourseStore();

  /* -------- Normalized Cart -------- */
  const courses = useMemo(
    () => cart.map(normalizeCourse),
    [cart]
  );

  /* -------- Buy Now -------- */
  const handleBuyNow = useCallback(
    (course) => {
      const token =
        JSON.parse(localStorage.getItem("token"))?.state
          ?.token;

      if (!token) {
        navigate("/login");
        return;
      }

      if (!course.enrollLink) {
        alert("Enrollment link not available");
        return;
      }

      window.open(course.enrollLink, "_blank", "noopener");
    },
    [navigate]
  );

  /* -------- Remove -------- */
  const handleRemove = useCallback(
    (id) => removeFromCart(id),
    [removeFromCart]
  );

  /* ------------------ EMPTY STATE ------------------ */
  if (!courses.length) {
    return (
      <motion.div
        className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <img
          src="examon_logo.svg"
          alt="Empty Cart"
          className="w-40 mb-6 opacity-80"
        />
        <h2 className="text-3xl font-bold text-gray-800">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mt-2">
          Add a course to get started 🚀
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/courses")}
          className="mt-8 bg-[var(--primary-color)] text-white px-8 py-3 rounded-full font-semibold"
        >
          Explore Courses
        </motion.button>
      </motion.div>
    );
  }

  /* ------------------ UI ------------------ */
  return (
    <motion.section
      className="min-h-screen bg-gray-50 py-10 px-4 md:px-10 lg:px-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl flex items-center justify-between gap-4 font-bold text-gray-800 mb-8">
        Your Cart   <div className="flex gap-2 items-center"> <FiShoppingCart/>({courses.length})</div> 
      </h1>

      <div className="space-y-6 max-h-[70vh] overflow-auto pr-1">
        <AnimatePresence>
          {courses.map((course) => (
            <motion.article
              key={course.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="bg-white rounded-2xl items-center shadow-md p-5 flex flex-col sm:flex-row gap-5"
            >
              <img
                src={course.image}
                alt={course.title}
                loading="lazy"
                className="w-full sm:w-44 h-28 object-cover rounded-xl"
                onError={(e) =>
                  (e.target.src = "/placeholder-course.jpg")
                }
              />

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {course.title}
                  </h3>

                  <div className="mt-2 space-y-1">
                    {course.saving > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="line-through text-gray-400">
                          ₹{formatPrice(course.previous)}
                        </span>
                        {course.discountPercent > 0 && (
                          <span className="text-red-500 font-semibold">
                            {course.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    )}

                    <span className="text-2xl font-bold text-gray-900">
                      ₹{formatPrice(course.final)}
                    </span>
                  </div>
                </div>

              </div>
                {/* ACTIONS */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleBuyNow(course)}
                    className="bg-[var(--primary-color)] cursor-pointer text-white px-6 py-2 rounded-full font-semibold"
                  >
                    Buy Now
                  </motion.button>

                  <button
                    onClick={() => handleRemove(course.id)}
                    className="flex items-center cursor-pointer gap-2 text-sm text-red-500 hover:text-red-600"
                    aria-label="Remove course"
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default memo(Cart);
