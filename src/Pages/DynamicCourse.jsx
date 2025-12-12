import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ReminderPop from "../Component/Remider"
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

  const { batchData, fetchBatches, loading: batchLoading, error: batchError } = useBatchesStore();
  const { cart, addToCart } = useCourseStore();

  const [course, setCourse] = useState(null);

  // ---------------------- FETCH DATA ----------------------
  useEffect(() => {
    if (!batchData || batchData.length === 0) fetchBatches();
  }, [batchData, fetchBatches]);


  // ---------------------- FIND BATCH ----------------------
  const foundCourse = useMemo(() => {
    if (!Array.isArray(batchData)) return null;
    return batchData.find((item) => String(item._id) === String(courseId));
  }, [batchData, courseId]);


  // Update UI state
  useEffect(() => {
    setCourse(foundCourse);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [foundCourse]);


  // ---------------------- ENROLL HANDLER ----------------------
  const handleEnroll = useCallback(() => {
    const token = JSON.parse(localStorage.getItem("auth"))?.token;

    if (!token) {
      toast.info("Please login to add this batch to your favorites");
      setTimeout(() => navigate("/login"), 700);
      return;
    }

    if (!course) {
      toast.error("Unable to add batch right now. Please try again.");
      return;
    }

    const isAlreadyInCart = cart.some((item) => item.title === course.batchName);

    if (isAlreadyInCart) {
      toast.info("This batch is already in your favorites");
      return;
    }

    addToCart({
      title: course.batchName,
      image: course.images?.[1],
      id: course._id,
      price: course.price,
    });

    toast.success(`${course.batchName} added to your favorites!`);
  }, [course, cart, addToCart, navigate]);


  // ---------------------- LOADER / ERRORS ----------------------
  if (batchLoading) return <ShimmerLoader />;

  if (batchError)
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-red-600 mb-2">Failed to load batch</h2>
        <p className="text-gray-600">{batchError}</p>
      </main>
    );

  if (!course)
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">Batch Not Found</h2>
        <p className="text-gray-600">The batch you're looking for doesn’t exist or was removed.</p>
      </main>
    );

  console.log(course)
  // ---------------------- FULL UI LAYOUT (UNCHANGED) ----------------------
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
        {/* HERO */}
        <motion.section variants={fadeInUp} initial="hidden" animate="show" className="w-full">
          <DHero
            title={course.batchName}
            image={course.images?.[1]}
            actualprice={course.price}
            insideCourses={course.teachers}
            onEnroll={handleEnroll}
          />
        </motion.section>


        {/* STAGES */}
        <motion.section variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="w-full">
          <StagesOfSSC item={course} />
        </motion.section>


        {/* PERKS */}
        <motion.div
          className="flex flex-wrap items-center gap-3 mt-4"
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        >

          <motion.div
            className="flex flex-wrap items-center gap-3 mt-4"
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
          >
            {course?.perks?.split(",").map((perk, index) => (
              <motion.span
                key={index}
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200 text-sm font-semibold shadow-md flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                {perk.trim()}
              </motion.span>
            ))}
          </motion.div>


        </motion.div>


        {/* SECTIONS */}
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


        {/* RELATED COURSES */}
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
