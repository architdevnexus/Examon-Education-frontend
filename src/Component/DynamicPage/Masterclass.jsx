import React, { useState, useCallback } from "react";
import { GrFormNextLink } from "react-icons/gr";
import { FaArrowDown } from "react-icons/fa";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

/**
 * Masterclass Component
 * -------------------------------------------------------
 * Responsive, animated info cards section for displaying
 * the key highlights of a course masterclass.
 *
 * - Fully responsive (stacked on mobile, fluid flex on desktop)
 * - Smooth transitions using Framer Motion layout animations
 * - Accessible button-based interactions
 * - Optimized for re-renders and event handling
 */

const Masterclass = ({ item }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const Data = [
    {
      id: 1,
      title: "Deep Concept Clarity",
      desc: "Understand every concept from Civil, Electrical, or Mechanical Engineering with simplified explanations.",
    },
    {
      id: 2,
      title: "Exam-Focused Approach",
      desc: "Focused coverage of important topics, helping you target high-scoring areas effectively.",
    },
    {
      id: 3,
      title: "Practical Application",
      desc: "Relate theoretical concepts with real-world engineering problems through practical demonstrations.",
    },
    {
      id: 4,
      title: "Doubt Solving",
      desc: "Get your queries answered live during the session to ensure complete conceptual clarity.",
    },
    {
      id: 5,
      title: "Smart Strategy",
      desc: "Learn exam techniques, time management, and smart methods to boost your SSC JE score.",
    },
  ];

  /**
   * Toggle handler — responsive for both hover and click.
   */
  const handleToggle = useCallback((id) => {
    if (window.innerWidth < 768) {
      setActiveIndex((prev) => (prev === id ? null : id));
    }
  }, []);

  const handleHover = useCallback((id) => {
    if (window.innerWidth >= 768) {
      setActiveIndex(id);
    }
  }, []);

  const handleLeave = useCallback(() => {
    if (window.innerWidth >= 768) {
      setActiveIndex(null);
    }
  }, []);

  return (
    <section className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 md:px-12 bg-white w-full overflow-hidden">
      {/* ================= Header ================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full max-w-full mb-10 text-center md:text-left"
      >
        <p className="text-sm md:text-base text-gray-600">
          What You’ll Learn in this
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-[var(--primary-color)] leading-snug">
          {item?.examCategory || "SSC JE"} Masterclass
        </h2>
      </motion.div>

      {/* ================= Animated Cards ================= */}
      <LayoutGroup>
        <motion.div
          layout
          className="flex flex-col sm:flex-row flex-wrap w-full max-w-full gap-1 justify-center transition-all duration-300"
        >
          {Data.map(({ id, title, desc }) => {
            const isActive = activeIndex === id;

            return (
              <motion.button
                key={id}
                layout
                // whileHover={{ scale: 1.03 }}
                // whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                onClick={() => handleToggle(id)}
                onMouseEnter={() => handleHover(id)}
                onMouseLeave={handleLeave}
                className={`relative group text-left h-52 flex flex-col justify-between p-5 rounded-2xl shadow-md border transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  isActive
                    ? "bg-[var(--primary-color)] text-white border-transparent"
                    : "bg-[#E9F6FF] text-[#333] border-gray-200 hover:bg-[var(--primary-color)] hover:text-white"
                }`}
                style={{
                  flex: isActive ? 1.3 : 1,
                  minWidth: "240px",
                  maxWidth: "100%",
                }}
              >
                {/* Title + Arrow */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg md:text-xl font-semibold leading-snug">
                    {title}
                  </span>
                  <motion.span
                    animate={{ rotate: isActive ? 0 : 0 }}
                    transition={{ duration: 3 }}
                    className="bg-white text-[var(--primary-color)] p-2 rounded-full shadow-sm"
                  >
                    {isActive ? <FaArrowDown /> : <GrFormNextLink />}
                  </motion.span>
                </div>

                {/* Description with animation */}
                <AnimatePresence>
                  {isActive && (
                    <motion.p
                      key={id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="text-sm font-light leading-relaxed mt-2 pr-2"
                    >
                      {desc}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </motion.div>
      </LayoutGroup>
    </section>
  );
};

export default Masterclass;
