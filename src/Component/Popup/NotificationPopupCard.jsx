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

  // Swipe detect
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
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-lg flex items-center justify-center px-4"
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
          className="relative rounded-3xl p-8 md:p-12 w-full max-w-5xl
            bg-gradient-to-br from-[#2D2D2D]/95 to-[#79ABCD]/95
            shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 bg-black/40 p-1 rounded-full text-gray-300 hover:text-white transition"
          >
            <X size={15} />
          </button>

          {/* Layout unchanged */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col gap-3 flex-1">
              <h3 className="text-sm text-gray-400 uppercase tracking-widest">
                {item.title}
              </h3>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {item.subtitle}
              </h1>
              <p className="text-gray-300">{item.description}</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleNavigate}
                className="mt-4 px-6 py-3 rounded-full bg-[var(--primary-color)] text-white font-semibold"
              >
                Enroll Now →
              </motion.button>
            </div>

            <div className="flex-1 flex justify-center">
              <img
                src={item.image}
                className="w-full h-72 rounded-2xl object-cover shadow-lg"
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-[5px] bg-white/20 mt-6 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--primary-color)] transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {items.map((_, i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  i === index ? "bg-white scale-110" : "bg-white/40"
                }`}
              ></div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPopup;
