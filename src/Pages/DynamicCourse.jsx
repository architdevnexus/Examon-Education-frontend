import React, { useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ReminderPop from "../Component/Remider";

// Components
import DHero from "../Component/DynamicPage/DHero";
import { StagesOfSSC } from "../Component/StagesOfSSC";
import CoursesYouLike from "../Component/CoursesYouLike";
import MeetMentor from "../Component/DynamicPage/MeetYourMentor";
import QuizandNotes from "../Component/DynamicPage/QuizandNotes";
import Masterclass from "../Component/DynamicPage/Masterclass";
import MasterClassSection from "../Component/MasterClassSection";

// Store
import { useBatchesStore } from "../Zustand/GetLiveBatches";
import { useCourseStore } from "../Zustand/GetAllCourses";

// ---------------------- SHIMMER LOADER ----------------------
const ShimmerLoader = () => (
  <div className="w-full min-h-screen mb-20 flex flex-col items-center justify-center p-6 bg-gray-50 animate-pulse">
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

// ---------------------- ANIMATION VARIANT ----------------------
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// ---------------------- PAGE COMPONENT ----------------------
const DynamicCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    batchData,
    fetchBatches,
    loading: batchLoading,
    error: batchError,
    hasFetched,
  } = useBatchesStore();

  const { cart, addToCart } = useCourseStore();

  // ---------------------- FETCH DATA (SAFE) ----------------------
  useEffect(() => {
    if (!hasFetched) {
      fetchBatches();
    }
  }, [hasFetched, fetchBatches]);

  // ---------------------- SCROLL ON COURSE CHANGE ----------------------
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [courseId]);

  // ---------------------- FIND COURSE ----------------------
  const course = useMemo(() => {
    if (!Array.isArray(batchData)) return null;
    return batchData.find((item) => String(item._id) === String(courseId));
  }, [batchData, courseId]);

  // ---------------------- ENROLL HANDLER ----------------------
  const handleEnroll = useCallback(
    (enrollLink) => {
      const storedToken = JSON.parse(localStorage.getItem("token"))?.state?.token;


      if (!storedToken) {
        toast.info("Please login to add this batch to your favorites");
        setTimeout(() => navigate("/login"), 700);
        return;
      }

      if (!course || !course._id) {
        toast.error("Unable to add batch right now. Please try again.");
        return;
      }

      if (!enrollLink) {
        toast.error("Enrollment link not available.");
        return;
      }

      // Open enroll link in new tab
      const newTab = window.open(enrollLink, "_blank", "noopener,noreferrer");

      if (!newTab) {
        toast.error("Popup blocked. Please allow popups.");
        return;
      }

      toast.success(`${course.batchName} added to your favorites!`);
    },
    [course, cart, addToCart, navigate]
  );


  // ---------------------- LOADERS & ERRORS ----------------------
  if (batchLoading) return <ShimmerLoader />;

  if (batchError)
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-red-600 mb-2">
          Failed to load batch
        </h2>
        <p className="text-gray-600">{batchError}</p>
      </main>
    );

  if (!course)
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
          Batch Not Found
        </h2>
        <p className="text-gray-600">
          The batch you're looking for doesn’t exist or was removed.
        </p>
      </main>
    );
  console.log(course)
  // ---------------------- UI (UNCHANGED) ----------------------
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
        <motion.section variants={fadeInUp} initial="hidden" animate="show" className="w-full">
          <DHero
            title={course?.batchName}
            image={course?.images?.[1]}
            actualprice={course?.price}
            insideCourses={course?.teachers}
            perks={course?.syllabus}
            onEnroll={() => handleEnroll(course?.enrollLink)}
          />

        </motion.section>

        <motion.section
  variants={fadeInUp}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
  className="
    w-full sm:w-[95%] lg:w-[90%]
    max-w-5xl
    mx-auto
    bg-white
    rounded-2xl
    shadow-md hover:shadow-lg
    transition-shadow duration-300
    border border-gray-100
    p-5 sm:p-6 md:p-8
    relative
    overflow-hidden
  "
>
  {/* Top Accent */}
  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />

  {/* Course Overview */}
  <header className="mb-6">
    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
      Course Overview
    </h2>
    <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
      {course?.description || "No description available."}
    </p>
  </header>

  {/* Additional Assistance */}
  {Array.isArray(course?.link) && course.link.length > 0 && (
    <section>
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4">
        Additional Assistance
      </h3>

      <div className="space-y-3">
        {course.link.map((item) => (
          <div
            key={item.id}
            className="
              flex items-center justify-between
              bg-gray-50
              rounded-lg
              px-4 py-3
              hover:bg-gray-100
              transition-colors
            "
          >
            <span className="text-sm sm:text-base font-medium text-gray-700">
              {item.title}
            </span>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-sm sm:text-base
                text-indigo-600
                font-medium
                hover:text-indigo-700
                underline-offset-4
                hover:underline
              "
            >
              Open →
            </a>
          </div>
        ))}
      </div>
    </section>
  )}
</motion.section>


        <motion.section variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="w-full">
          <StagesOfSSC item={course} />
        </motion.section>

        <motion.section variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="w-full">
          <Masterclass item={course} />
        </motion.section>

        <motion.section variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="w-full">
          <QuizandNotes />
        </motion.section>

        <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="w-full">
          <MasterClassSection />
        </motion.div>

        <motion.section variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="w-full mt-6">
          <MeetMentor />
        </motion.section>

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

      <ReminderPop item={course} />
    </AnimatePresence>
  );
};

export default DynamicCourse;
