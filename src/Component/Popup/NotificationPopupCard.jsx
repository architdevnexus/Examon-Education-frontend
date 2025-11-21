import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationPopup = ({ items = [], onClose }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef(null);
  const item = items[index];

  // Auto slide every 6 seconds
  useEffect(() => {
    setProgress(0);

    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 1.7;
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [index]);

  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  // Swipe
  const handleDragEnd = (e, info) => {
    if (info.offset.x < -50) next();
    if (info.offset.x > 50) prev();
  };

  const slideAnim = {
    hidden: { opacity: 0, x: 120 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: -120, transition: { duration: 0.3 } },
  };

  const handleNavigate = () => {
    if (!item.link) return;
    onClose();
    setTimeout(() => navigate(`/${item.link}`), 200);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-lg flex items-center justify-center px-2 sm:px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          variants={slideAnim}
          initial="hidden"
          animate="visible"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="
            relative rounded-xl sm:rounded-3xl p-4 sm:p-8 md:p-12 
            w-full max-w-lg sm:max-w-3xl md:max-w-5xl
            bg-gradient-to-br from-[#2D2D2D]/95 to-[#79ABCD]/95
            shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10
            transition-all
          "
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-black/40 p-1 sm:p-1.5 rounded-full text-gray-300 hover:text-white transition"
          >
            <X size={15} />
          </button>

          {/* Layout (responsive) */}
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
            
            {/* Text Section */}
            <div className="flex flex-col gap-2 sm:gap-3 flex-1 text-center md:text-left">
              <h3 className="text-xs sm:text-sm text-gray-300 uppercase tracking-widest">
                {item.title}
              </h3>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug">
                {item.subtitle}
              </h1>

              <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleNavigate}
                className="
                  mt-3 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 
                  rounded-full bg-[var(--primary-color)] 
                  text-white font-semibold text-xs sm:text-sm
                "
              >
                Enroll Now →
              </motion.button>
            </div>

            {/* Image Section */}
            <div className="flex-1 flex justify-center">
              <img
                src={item.image}
                className="
                  w-40 h-40 sm:w-60 sm:h-60 md:w-full md:h-72 
                  rounded-lg sm:rounded-2xl object-cover shadow-lg
                "
              />
            </div>

          </div>

          {/* Progress Bar */}
          <div className="w-full h-[4px] bg-white/30 mt-4 sm:mt-6 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary-color)] transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {items.map((_, i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                className={`
                  w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer 
                  ${i === index ? "bg-white scale-110" : "bg-white/40"}
                `}
              ></div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPopup;
