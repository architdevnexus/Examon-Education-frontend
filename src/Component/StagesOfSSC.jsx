import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Data from "../DataStore/Stages.json";

export const StagesOfSSC = ({item}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Memoized values to avoid re-rendering Data or derived values unnecessarily
  const totalStages = useMemo(() => Data.length - 1, []);
  const progressHeight = useMemo(
    () => (activeIndex / totalStages) * 100,
    [activeIndex, totalStages]
  );

  // Auto-progress stages (play once)
  useEffect(() => {
    if (activeIndex < totalStages) {
      const timer = setTimeout(() => setActiveIndex((prev) => prev + 1), 2000);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, totalStages]);

  return (
    <section className="w-full flex flex-col items-center justify-center py-12 bg-white overflow-hidden">
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-bold text-[#4D4D4D] mb-10 text-center"
      >
        Stages of the {item.examCategory} Masterclass
      </motion.h2>

      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-10 px-4">
        {/* Left Section - Stages with animated progress line */}
        <div className="relative flex flex-col gap-6 w-full md:w-2/3">
          {/* Progress Line */}
          <div className="absolute left-[6px] top-3 bottom-3 w-[2px] bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full bg-[var(--primary-color)]"
              initial={{ height: 0 }}
              animate={{ height: `${progressHeight}%` }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />
          </div>

          {/* Stage Items */}
          {Data.map((item, index) => {
            const isActive = activeIndex === index;
            const isCompleted = activeIndex > index;

            return (
              <motion.div
                key={item.id}
                onClick={() => setActiveIndex(index)}
                className="flex items-center gap-10 relative z-10 cursor-pointer"
                // whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                {/* Dot Indicator */}
                <motion.div
                  layout
                  className={`w-3 h-3 rounded-full transition-colors duration-500 ${
                    isActive || isCompleted
                      ? "bg-[var(--primary-color)]"
                      : "bg-[#B0D9FF]"
                  }`}
                />

                {/* Stage Text */}
                <span
                  className={`font-semibold transition-colors duration-500 ${
                    isActive
                      ? "text-[var(--primary-color)] text-lg"
                      : isCompleted
                      ? "text-gray-700"
                      : "text-[#6EA8FF]"
                  }`}
                >
                  {item.title}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Right Section - Image & Description */}
        <div
          className="relative flex flex-col items-center md:w-1/2 bg-contain bg-no-repeat bg-center"
          style={{
            backgroundImage: 'url("/stagesbg.svg")',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={Data[activeIndex].id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <motion.img
                src={Data[activeIndex].image}
                alt={Data[activeIndex].title}
                className="w-[220px] md:w-[260px] rounded-xl object-contain mx-auto shadow-md"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              />
              <p className="text-center text-[#6D6D6D] mt-4 text-sm md:text-base max-w-lg leading-relaxed">
                {Data[activeIndex].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default StagesOfSSC;
