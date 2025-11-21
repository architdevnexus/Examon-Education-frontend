import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useCourseStore } from "../Zustand/GetAllCourses";
import ContactSection from "../Component/ContactSection";
import CoursesCard from "../Component/Card/CoursesCard";

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  const {
    loading,
    error,
    data,
    categories,
    selectedCategory,
    fetchCourses,
    fetchCoursesByCategory,
  } = useCourseStore();

  // Local pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 3;

  // Fetch courses initially
  useEffect(() => {
    fetchCourses();
  }, []);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTerm(searchTerm.toLowerCase()), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filter + search logic
  const filteredCourses = useMemo(() => {
    let filtered =
      selectedCategory === "All"
        ? data
        : data.filter((c) => c.examCategory === selectedCategory);

    if (debouncedTerm) {
      filtered = filtered.filter((course) =>
        course.courseDetails?.toLowerCase().includes(debouncedTerm)
      );
    }

    return filtered;
  }, [data, selectedCategory, debouncedTerm]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredCourses.length / perPage);

  // Infinite pagination logic
  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1));
  };

  // Paginated slice
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredCourses.slice(start, start + perPage);
  }, [filteredCourses, currentPage, perPage]);

  // Framer Motion animation preset
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <main className="flex flex-col items-center w-full bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center md:items-start w-full py-20 px-6 md:px-12 bg-gradient-to-r from-[var(--primary-color)] to-blue-800 text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="z-10 flex flex-col gap-4 max-w-7xl w-full text-center md:text-left"
        >
          <h1 className="font-extrabold text-4xl md:text-5xl leading-tight">
            Explore Our Courses
          </h1>
          <p className="text-white/90 text-sm md:text-base md:w-2/3">
            Build your future with India’s most trusted learning platform.
            Explore, learn, and achieve excellence with our curated programs.
          </p>
        </motion.div>

        {/* Search + Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 flex flex-col sm:flex-row justify-center md:justify-start w-full max-w-7xl mt-10 gap-4"
        >
          {/* Search Bar */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg w-full sm:max-w-md hover:shadow-xl transition-all duration-300">
            <FaSearch className="text-[var(--primary-color)] text-lg" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow outline-none text-[var(--primary-color)] placeholder:text-gray-400 text-sm md:text-base bg-transparent"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => fetchCoursesByCategory(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all cursor-pointer appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Course Grid Section */}
      <section className="w-full bg-[#EEF6FC] px-6 md:px-10 lg:px-14 py-14 flex justify-center">
        {loading ? (
          <p className="text-gray-600 text-center text-lg">Loading courses...</p>
        ) : error ? (
          <p className="text-red-500 text-center text-lg">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 max-w-7xl w-full">
            <AnimatePresence>
              {paginatedCourses.length > 0 ? (
                paginatedCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CoursesCard {...course} />
                  </motion.div>
                ))
              ) : (
                <motion.p
                  key="no-result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 col-span-full text-base md:text-lg"
                >
                  No courses found matching “{searchTerm}”
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* 🔹 Infinite Pagination with Dots */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-12 mt-2 pb-12">
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-white border-b cursor-pointer text-sm font-medium hover:bg-gray-100 transition-all"
          >
            Prev
          </button>

          {/* Dots */}
          <div className="flex gap-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <span
                key={i}
                className={`w-12 h-1 rounded-full transition-all duration-300 ${i + 1 === currentPage
                    ? "bg-[var(--primary-color)] scale-125"
                    : "bg-gray-300"
                  }`}
              ></span>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-white border-b cursor-pointer text-sm font-medium hover:bg-gray-100 transition-all"
          >
            Next
          </button>
        </div>
      )}

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full py-10"
      >
        <ContactSection />
      </motion.section>
    </main>
  );
};

export default Courses;
