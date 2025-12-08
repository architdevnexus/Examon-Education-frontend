import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

// Components
import DHero from "../Component/DynamicPage/DHero";
import { StagesOfSSC } from "../Component/StagesOfSSC";
import CoursesYouLike from "../Component/CoursesYouLike";
import MeetMentor from "../Component/DynamicPage/MeetYourMentor";
import QuizandNotes from "../Component/DynamicPage/QuizandNotes";
import Masterclass from "../Component/DynamicPage/Masterclass";
import MasterClassSection from "../Component/MasterClassSection";

// Store
import { useCourseStore } from "../Zustand/GetAllCourses";

// Skeleton Loader
const ShimmerLoader = () => (
  <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 animate-pulse">
    <div className="w-full max-w-4xl space-y-4">
      <div className="h-48 bg-gray-200 rounded-lg"></div>
      <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
      <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
      <div className="flex space-x-3 mt-6">
        <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
        <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
      </div>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

// Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const DynamicCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    data,
    cart,
    loading,
    error,
    fetchCourses,
    addToCart,
  } = useCourseStore();

  const [course, setCourse] = useState(null);

  // Fetch courses initially
  useEffect(() => {
    if (!data || data.length === 0) fetchCourses();
  }, [data, fetchCourses]);

  // Find course by ID
  const foundCourse = useMemo(() => {
    if (!Array.isArray(data)) return null;
    return data.find((item) => String(item.id) === String(courseId));
  }, [data, courseId]);

  // Update local state
  useEffect(() => {
    setCourse(foundCourse);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [foundCourse]);

  // ========== Add to Cart / Favorite ==========
  const handleEnroll = useCallback(() => {
    const token = JSON.parse(localStorage.getItem("token"))?.state?.token;

    if (!token) {
      toast.info("Please login to add this course to your favorites");
      setTimeout(() => navigate("/login"), 700);
      return;
    }

    if (!course) {
      toast.error("Unable to add course right now. Please try again.");
      return;
    }

    if (cart.some((item) => item.id === course.id)) {
      toast.info("This course is already in your favorites");
      return;
    }

    addToCart(course);
    toast.success(`${course.courseDetails} added to your favorites!`);
  }, [course, cart, addToCart, navigate]);

  // Loading State
  if (loading) return <ShimmerLoader />;

  // Error UI
  if (error)
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-red-600 mb-2">
          Failed to load course
        </h2>
        <p className="text-gray-600 text-sm md:text-base">{error}</p>
      </main>
    );

  // Not Found
  if (!course)
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
          Course Not Found
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          The course you’re looking for doesn’t exist or was removed.
        </p>
      </main>
    );

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={courseId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full flex flex-col items-center bg-white"
      >
        {/* Hero Section */}
        <motion.section variants={fadeInUp} initial="hidden" animate="show" className="w-full">
          <DHero
            title={course.courseDetails}
            image={course.img}
            previousPrice={course.amount}
            currentPrice={course.actualprice}
            percent={course.percent}
            perks={course.perks}
            onEnroll={handleEnroll}
            actualprice={course.actualprice}
            insideCourses={course?.insideCourses}
          />
        </motion.section>

        {/* Stages */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="w-full">
          <StagesOfSSC item={course} />
        </motion.section>

        {/* Perks */}
        <motion.div
          className="flex flex-wrap items-center gap-3 mt-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
        >
          {course?.perks?.map((perk, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200 text-sm font-semibold shadow-md hover:shadow-lg hover:from-red-100 hover:to-red-200 transition-all duration-300 flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              {perk}
            </motion.span>
          ))}
        </motion.div>

        {/* Masterclass */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="w-full">
          <Masterclass item={course} />
        </motion.section>

        {/* Quiz and Notes */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="w-full">
          <QuizandNotes />
        </motion.section>

        {/* Additional Masterclass */}
        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="w-full">
          <MasterClassSection />
        </motion.div>

        {/* Meet Mentor */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="w-full mt-6">
          <MeetMentor />
        </motion.section>

        {/* Related Courses */}
        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="w-full py-8 mb-18 bg-[#F9FAFB]"
        >
          <CoursesYouLike title={false} />
        </motion.section>
      </motion.main>
    </AnimatePresence>
  );
};

export default DynamicCourse;
