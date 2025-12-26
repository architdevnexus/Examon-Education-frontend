import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import ContactSection from "../Component/ContactSection";
import { useBatchesStore } from "../Zustand/GetLiveBatches";
import CoursesCard from "../Component/Card/CoursesCard";
import { useBanners } from "../Zustand/GetBanners";


/* -------------------- CONSTANTS -------------------- */
const PER_PAGE = 6;

/* -------------------- ANIMATION -------------------- */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* -------------------- SHIMMER -------------------- */
const ShimmerCard = () => (
  <div className="w-full h-[600px] bg-gray-200 animate-pulse rounded-xl" />
);

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const { fetchBatches, batchData = [], loading, error } = useBatchesStore();

  /* -------------------- FETCH -------------------- */
  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);
// console.log(batchData)
  const [banner, setbanner] = useState()
  const { fetchBanners, banners } = useBanners();
  useEffect(() => {
    fetchBanners()
  }, [])
// console.log(batchData)
  // Derived banner URL (no extra state)
  const aboutBannerUrl = useMemo(() => {
    return banners?.[0]?.courseBanner?.[0]?.url || "";
  }, [banners]);
  console.log(banners)

  /* -------------------- DEBOUNCE SEARCH -------------------- */
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedTerm(searchTerm.trim().toLowerCase()),
      300
    );
    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* -------------------- RESET PAGE ON FILTER -------------------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, debouncedTerm]);

  /* -------------------- CATEGORIES -------------------- */
  const categories = useMemo(() => {
    const unique = new Set(
      batchData
        .map((b) => b.categoryName)
        .filter(Boolean)
    );
    return ["All", ...Array.from(unique)];
  }, [batchData]);

  /* -------------------- FILTER + SEARCH -------------------- */
  const filteredCourses = useMemo(() => {
    return batchData.filter((course) => {
      const matchCategory =
        selectedCategory === "All" ||
        course.categoryName === selectedCategory;

      const matchSearch =
        !debouncedTerm ||
        course.batchName?.toLowerCase().includes(debouncedTerm);

      return matchCategory && matchSearch;
    });
  }, [batchData, selectedCategory, debouncedTerm]);

  /* -------------------- PAGINATION -------------------- */
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PER_PAGE));

  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredCourses.slice(start, start + PER_PAGE);
  }, [filteredCourses, currentPage]);

  const handleNext = useCallback(
    () => setCurrentPage((p) => (p === totalPages ? 1 : p + 1)),
    [totalPages]
  );

  const handlePrev = useCallback(
    () => setCurrentPage((p) => (p === 1 ? totalPages : p - 1)),
    [totalPages]
  );

  return (
    <main className="flex flex-col items-center w-full bg-white min-h-screen">
      {/* ================= HERO ================= */}
      <section className="relative w-full h-[60vh] sm:h-[40vh] py-20 px-6 md:px-12 text-white"
        style={{
          background: `url(${aboutBannerUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Optional overlay for better text contrast */}
        <div className="absolute -inset-t-1 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto text-center md:text-left"
        >
          <h1 className="font-extrabold text-4xl md:text-5xl">
            Explore Our Courses
          </h1>
          <p className="text-white/90 text-sm md:text-base md:w-2/3 mt-4">
            Build your future with India’s most trusted learning platform.
          </p>
        </motion.div>

        {/* SEARCH + FILTER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 max-w-7xl mx-auto mt-10"
        >
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg w-full sm:max-w-md">
            <FaSearch className="text-[var(--primary-color)]" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses..."
              className="flex-grow bg-transparent outline-none text-sm text-[var(--primary-color)]"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-64 bg-gray-200 text-(--primary-color) border border-gray-300 py-3 px-4 rounded-xl shadow-sm cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
        </motion.div>
      </section>

      {/* ================= GRID ================= */}
      <section className="w-full bg-[#EEF6FC] px-6 md:px-10 lg:px-14 py-14 flex justify-center">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
            {Array.from({ length: PER_PAGE }).map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
            <AnimatePresence>
              {paginatedCourses.length ? (
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
                      batchName={course.batchName}
                      duration={course.duration}
                      price={course.price}
                      description={course.description}
                      syllabus={course.syllabus}
                      teachers={course.teachers || []}
                      perks={course.perks}
                      enrollLink={course.enrollLink}
                      discountPercent={course?.discountPercent}
                      discount={course?.discount}
                      // enrollLink={course?.enrollLink}
                    />
                  </motion.div>
                ))
              ) : (
                <p className="text-center col-span-full text-gray-500">
                  No courses found matching “{searchTerm}”
                </p>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-12 pb-12">
          <button onClick={handlePrev} className="border-b px-4 py-2">
            Prev
          </button>
          <div className="flex gap-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <span
                key={i}
                className={`w-12 h-1 rounded-full ${i + 1 === currentPage
                  ? "bg-[var(--primary-color)] scale-125"
                  : "bg-gray-300"
                  }`}
              />
            ))}
          </div>
          <button onClick={handleNext} className="border-b px-4 py-2">
            Next
          </button>
        </div>
      )}

      {/* ================= CONTACT ================= */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="w-full py-10"
      >
        <ContactSection />
      </motion.section>
    </main>
  );
};

export default Courses;
