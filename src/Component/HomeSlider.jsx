import React, { useState, useEffect, useRef, useCallback } from "react";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useBatchesStore } from "../Zustand/GetLiveBatches";

const HomeSlider = () => {
  const navigate = useNavigate();
  const { loading, error, batchData, fetchBatches } = useBatchesStore();

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  /** ---------------------------
   * FIX 1: Prevent infinite re-fetch
   * --------------------------- */
  useEffect(() => {
    fetchBatches(); // run ONCE
  }, []); // <--- FIX

  /** ---------------------------
   * Auto-slide Logic
   * --------------------------- */
  useEffect(() => {
    if (!batchData.length) return;

    const timer = setTimeout(() => {
      setDirection(1);
      setCurrent((prev) => (prev === batchData.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearTimeout(timer);
  }, [current, batchData.length]);

  /** ---------------------------
   * Manual Controls
   * --------------------------- */
  const nextSlide = useCallback(() => {
    if (!batchData.length) return;
    setDirection(1);
    setCurrent((prev) => (prev === batchData.length - 1 ? 0 : prev + 1));
  }, [batchData.length]);

  const prevSlide = useCallback(() => {
    if (!batchData.length) return;
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? batchData.length - 1 : prev - 1));
  }, [batchData.length]);

  /** ---------------------------
   * Touch Gestures
   * --------------------------- */
  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) nextSlide();
    if (touchStartX.current - touchEndX.current < -50) prevSlide();
  };

  /** ---------------------------
   * Framer Motion Variants
   * --------------------------- */
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
    exit: (dir) => ({
      x: dir > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.7, ease: "easeInOut" },
    }),
  };

  /** ---------------------------
   * Loading / Error / No Data
   * --------------------------- */
  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-600 text-lg">
        Loading batches...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-600 text-lg">
        Failed to load batches: {error}
      </div>
    );

  if (!batchData.length)
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-500 text-lg">
        No batches available.
      </div>
    );

  const batch = batchData[current];

  return (
    <div className="p-2">
      <div
        className="relative w-full h-[70vh] sm:h-[75vh] overflow-hidden rounded-2xl shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <img
              src={batch?.images?.[0]}
              alt={batch.batchName}
              className="w-full h-full object-cover rounded-2xl"
            />

            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end items-start p-8 md:p-14 text-white rounded-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 max-w-2xl leading-tight">
                {batch.batchName}
              </h2>

              <p className="text-lg mb-3">
                {batch.syllabus || "Comprehensive syllabus included"}
              </p>

              <p className="mb-6 text-sm sm:text-base opacity-90">
                Duration: {batch.duration} | Price: ₹{batch.price}
              </p>

              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  onClick={() =>
                    window.open(
                      batch.link || "https://classplusapp.com/",
                      "_blank"
                    )
                  }
                  className="bg-[var(--primary-color)] cursor-pointer hover:bg-[var(--text-color)] transition-all duration-300 text-white px-2 md:px-6 py-1 sm:py-2 rounded-full font-semibold"
                >
                  Enroll Now
                </button>

                <button
                  className="bg-transparent border-2 rounded-3xl cursor-pointer transition-all duration-300 text-white px-3 sm:px-6 py-1 sm:py-2 font-semibold"
                  onClick={() => navigate("/courses")}
                >
                  Explore Courses
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-1 text-[var(--secondary-color)] text-4xl p-2 sm:p-3 -translate-y-1/2 z-20"
        >
          <MdNavigateBefore size={60} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-1 text-[var(--secondary-color)] text-4xl p-2 sm:p-3 -translate-y-1/2 z-20"
        >
          <MdNavigateNext size={60} />
        </button>
      </div>
    </div>
  );
};

export default HomeSlider;
