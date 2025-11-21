import React, { useRef, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import { motion } from "framer-motion";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import TestimonialCard from "../Card/TestimonialCard";
import { useReviewStore } from "../../Zustand/GetReview";

const HomeTestimonial = () => {
  const swiperRef = useRef(null);
  const { loading, error, fetchReviews, reviewData } = useReviewStore();

  // Fetch reviews once on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Filter only approved (active) reviews for display
  const approvedReviews = useMemo(
    () => reviewData?.filter((r) => r.status === "active"),
    [reviewData]
  );

  // 🎬 Animation Variants
  const textVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const fadeVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
  };

  // 🧠 Loading and Error States
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 bg-white">
        <p className="text-lg text-gray-600 animate-pulse">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center py-24 bg-white text-center">
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={() => fetchReviews()}
          className="mt-3 px-5 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--secondary-color)] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  if (approvedReviews.length === 0) {
    return (
      <div className="flex justify-center items-center py-24 bg-white">
        <p className="text-gray-500 text-lg">No approved reviews available yet.</p>
      </div>
    );
  }

  // MAIN SECTION
  return (
    <section className="w-full bg-white overflow-hidden relative py-16">
      {/* 🔹 Decorative Backgrounds */}
      <motion.div
        className="absolute top-0 left-0 w-24 h-24 bg-[var(--secondary-color)] rounded-md opacity-20 -z-10"
        initial={{ x: -80, y: -80, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 0.2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-32 h-32 bg-[var(--secondary-color)] rounded-md opacity-20 -z-10"
        initial={{ x: 80, y: 80, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 0.2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      <div className="grid grid-cols-1 gap-8 md:gap-1 md:grid-cols-2 items-center justify-between">
        {/* 🔸 Left Text Section */}
        <motion.div
          variants={textVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full flex-col md:flex justify-between h-3/4 items-start text-center"
        >
          <div className="h-2 w-full bg-[#CCDEEB] mb-4 rounded-md" />
          <div className="flex flex-col px-3 items-start gap-3">
            <span className="text-[var(--text-color)] text-sm md:text-base tracking-wide font-semibold">
              OUR REVIEWS
            </span>
            <h2 className="text-3xl md:text-6xl font-bold text-[var(--primary-color)] mt-2">
              What Our Students Say
            </h2>
          </div>
          <div className="h-2 w-full bg-[#CCDEEB] mt-4 rounded-full" />
        </motion.div>

        {/* 🔸 Right Carousel Section */}
        <motion.div
          variants={fadeVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative flex items-center gap-3 justify-center md:h-[500px] w-full"
          style={{
            background: `url('./testimonialBack.svg') center/contain no-repeat`,
          }}
        >
          {/* Left Arrow */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => swiperRef.current?.swiper.slidePrev()}
            className="absolute hidden md:block md:left-[5%] z-20 bg-[var(--primary-color)] text-white p-3 rounded-full shadow-lg"
            aria-label="Previous testimonial"
          >
            <FaArrowLeft />
          </motion.button>

          {/* Swiper Component */}
          <div className="flex justify-center items-center w-full">
            <Swiper
              ref={swiperRef}
              modules={[EffectCards, Autoplay]}
              effect="cards"
              grabCursor={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              className="w-[300px] md:w-[360px] lg:w-[400px]"
            >
              {approvedReviews.map((review, index) => (
                <SwiperSlide key={review._id || index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <TestimonialCard
                      img={review.profilePicture}
                      name={review.clientname}
                      exam={review.course}
                      date={new Date(review.createdAt).toLocaleDateString()}
                      star={review.star}
                      review={review.review}
                    />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right Arrow */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => swiperRef.current?.swiper.slideNext()}
            className="absolute hidden md:block md:right-[5%] z-20 bg-[var(--primary-color)] text-white p-3 rounded-full shadow-lg"
            aria-label="Next testimonial"
          >
            <FaArrowRight />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeTestimonial;
