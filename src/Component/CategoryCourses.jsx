import React, { useEffect, useMemo, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import CoursesSmallCard from "./Card/CoursesSmallCard";
import { useBatchesStore } from "../Zustand/GetLiveBatches";
import { motion } from "framer-motion";

const CategoryCourses = ({ category }) => {
  const { batchData, loading, error, fetchBatches } = useBatchesStore();
  const hasFetched = useRef(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchBatches();
      hasFetched.current = true;
    }
  }, [fetchBatches]);

  /** 🔥 CORE LOGIC */
  const filteredBatches = useMemo(() => {
    if (!category) return batchData;

    const keyword = category.toLowerCase();

    return batchData.filter((batch) =>
      batch?.batchName?.toLowerCase().includes(keyword) ||
      batch?.syllabus?.toLowerCase().includes(keyword) ||
      batch?.description?.toLowerCase().includes(keyword)
    );
  }, [batchData, category]);
  console.log(filteredBatches)
  return (
    <div className="mt-8 w-full">
      <motion.h2
        className="text-2xl font-bold text-gray-800 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Courses in <span className="text-[var(--primary-color)]">{category}</span>
      </motion.h2>

      {loading && (
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-full h-32 bg-gray-200 animate-pulse rounded-xl"
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-600 font-medium">Failed to load courses.</p>
      )}

      {!loading && filteredBatches.length === 0 && (
        <p className="text-gray-500">No courses found in this category.</p>
      )}

      {!loading && filteredBatches.length > 0 && (
        <Swiper
          direction={isDesktop ? "vertical" : "horizontal"}
          spaceBetween={50}
          slidesPerView={isDesktop ? 1 : 1}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          modules={[Autoplay]}
          className="mySwiper w-full h-[400px] lg:h-[600px]"
        >
          {filteredBatches.map((batch) => (
            <SwiperSlide key={batch._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <CoursesSmallCard batch={batch} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default CategoryCourses;
