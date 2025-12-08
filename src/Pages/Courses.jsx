import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import ContactSection from "../Component/ContactSection";
import { useBatchesStore } from "../Zustand/GetLiveBatches";
import CoursesCard from "../Component/Card/CoursesCard";

// Shimmer Loader
const ShimmerCard = () => (
  <div className="w-full h-60 bg-gray-200 animate-pulse rounded-xl" />
);

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { fetchBatches, batchData = [], loading, error } = useBatchesStore();

  // Local pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 3;

  // Fetch batch data
  useEffect(() => {
    fetchBatches();
  }, []);
  console.log(batchData)
  // Search debounce
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTerm(searchTerm.toLowerCase()), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Extract categories
  const categories = useMemo(() => {
    const uniqueCats = new Set(batchData.map((item) => item.categoryName));
    return ["All", ...Array.from(uniqueCats)];
  }, [batchData]);

  // Filter + Search Logic
  const filteredCourses = useMemo(() => {
    let filtered =
      selectedCategory === "All"
        ? batchData
        : batchData.filter((c) => c.categoryName === selectedCategory);

    if (debouncedTerm) {
      filtered = filtered.filter((course) =>
        course.batchName?.toLowerCase().includes(debouncedTerm)
      );
    }
    return filtered;
  }, [batchData, selectedCategory, debouncedTerm]);

  const totalPages = Math.ceil(filteredCourses.length / perPage) || 1;

  const handleNext = () => {
    setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1));
  };

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredCourses.slice(start, start + perPage);
  }, [filteredCourses, currentPage]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <main className="flex flex-col items-center w-full bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center md:items-start w-full py-20 px-6 md:px-12 bg-gradient-to-r from-[var(--primary-color)] to-blue-800 text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="z-10 flex flex-col gap-4 max-w-7xl w-full text-center md:text-left"
        >
          <h1 className="font-extrabold text-4xl md:text-5xl leading-tight">Explore Our Courses</h1>
          <p className="text-white/90 text-sm md:text-base md:w-2/3">
            Build your future with India’s most trusted learning platform.
          </p>
        </motion.div>

        {/* SEARCH + FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 flex flex-col sm:flex-row justify-center md:justify-start w-full max-w-7xl mt-10 gap-4"
        >
          {/* SEARCH BAR */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg w-full sm:max-w-md">
            <FaSearch className="text-[var(--primary-color)] text-lg" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow outline-none text-[var(--primary-color)] placeholder:text-gray-400 text-sm md:text-base bg-transparent"
            />
          </div>

          {/* CATEGORY SELECT */}
          <div className="relative w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-xl shadow-sm focus:ring-2 focus:ring-[var(--primary-color)] cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </motion.div>
      </section>

      {/* COURSES GRID */}
      <section className="w-full bg-[#EEF6FC] px-6 md:px-10 lg:px-14 py-14 flex justify-center">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
            {Array.from({ length: 6 }).map((_, i) => <ShimmerCard key={i} />)}
          </div>
        ) : error ? (
          <p className="text-red-500 text-center text-lg">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
            <AnimatePresence>
              {paginatedCourses.length > 0 ? (
                paginatedCourses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CoursesCard
                      id={course._id}
                      img={course.images?.[1]}
                      duration={course.duration}
                      actualprice={course.price}
                      previousprice={course.price + 2000}
                      percent={Math.round(((course.price + 2000) - course.price) / (course.price + 2000) * 100)}
                      courseDetails={course.batchName}
                      insideCourses={course.syllabus ? course.syllabus.split(",") : []}
                      perks={course.teachers || []}
                      Discount={true}
                      amount={500}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 col-span-full"
                >
                  No courses found matching “{searchTerm}”
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-12 mt-2 pb-12">
          <button onClick={handlePrev} className="px-4 py-2 bg-white border-b hover:bg-gray-100">Prev</button>
          <div className="flex gap-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <span
                key={i}
                className={`w-12 h-1 rounded-full ${i + 1 === currentPage ? "bg-[var(--primary-color)] scale-125" : "bg-gray-300"}`}
              ></span>
            ))}
          </div>
          <button onClick={handleNext} className="px-4 py-2 bg-white border-b hover:bg-gray-100">Next</button>
        </div>
      )}

      {/* CONTACT */}
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
