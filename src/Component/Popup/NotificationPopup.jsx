import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationPopup = ({
  title = "New Course Launched",
  subtitle = "DDA 2025 - Shikhar Batch",
  description = "Ready to level up your preparation? Join our latest batch with structured lessons, quizzes, and expert guidance!",
  img = "/logo2.svg",
  path = "",
  onClose = () => { },
  autoClose = true,
  autoCloseDelay = 2000,
}) => {

  const navigate = useNavigate();

  /* Disable scroll while popup open */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  /* Auto close */
  useEffect(() => {
    if (!autoClose) return;
    const t = setTimeout(() => onClose(), autoCloseDelay);
    return () => clearTimeout(t);
  }, [autoClose, autoCloseDelay]);

  /* Safe navigation */
  const handleNavigate = () => {
    if (!path) return;
    onClose();
    setTimeout(() => navigate(`/${path}`), 250);
  };

  /* Motion Variants */
  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const card = {
    hidden: { opacity: 0, scale: 0.85, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.85,
      y: -20,
      transition: { duration: 0.25 },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-[9999] bg-black/50  backdrop-blur-xl 
                   flex items-center justify-center px-4"
      >
        <motion.div
          variants={card}
          className="
            relative rounded-3xl p-6 md:p-10 m-24 w-full max-w-4xl 
            bg-gradient-to-br from-[#2D2D2D]/90 to-[#79ABCD]/90
            shadow-[0_0_40px_rgba(0,0,0,0.4)]
            border-[8px] border-gray-500/20
            flex flex-col-reverse md:flex-row gap-8
          "
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 bg-black p-1 cursor-pointer rounded-full right-4 text-white/70 hover:text-white"
          >
            <X size={24} />
          </button>

          {/* Left Text Section */}
          <div className="flex flex-col justify-center flex-1 gap-4">
            <h3 className="text-sm tracking-widest text-white">
              {title}
            </h3>

            <h1 className="text-3xl md:text-4xl font-bold text-white leading-snug">
              {subtitle}
            </h1>

            <p className="text-gray-300 text-base leading-relaxed">
              {description}
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleNavigate}
              className="
                mt-4 px-6 py-3 w-fit rounded-full
                bg-[var(--primary-color)] hover:bg-[var(--secondary-color)]
                font-semibold text-white shadow-lg shadow-[var(--primary-color)]/30
              "
            >
              Enroll Now →
            </motion.button>
          </div>

          {/* Image Section */}
          <div className="relative flex justify-center md:justify-end">
            <img
              src={img}
              alt="Course"
              className="w-56 md:w-64 h-auto rounded-2xl object-cover"
              draggable="false"
            />

            {/* Decorative Badge */}
            <img
              src="/new 1.svg"
              className="absolute w-12 h-12 top-3 right-3 md:top-50 md:right-[-14px] rotate-[-6deg]"
              alt="badge"
              draggable="false"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPopup;
