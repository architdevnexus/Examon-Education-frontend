import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import CoursesSmallCard from "./Card/CoursesSmallCard";
import { useCourseStore } from "../Zustand/GetAllCourses";

const CoursesYouLike = ({ title = false }) => {
  const { data, error, loading, fetchCourses } = useCourseStore();

  // Fetch data when component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Swiper breakpoints for responsive design
  const breakpointsConfig = title
    ? {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 1 },
        1024: { slidesPerView: 1 },
      }
    : {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      };

  // Render Swiper
  const renderCarousel = () => (
    <Swiper
      direction={title ? "vertical" : "horizontal"}
      modules={[Autoplay]}
      slidesPerView={1}
      spaceBetween={25}
      loop
      autoplay={{
        delay: 2800,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      speed={900}
      breakpoints={breakpointsConfig}
      className={`w-full ${title ? "h-[65vh]" : ""}`}
    >
      {Array.isArray(data) && data.length > 0 ? (
        data.map((course) => (
          <SwiperSlide key={course.id || course._id}>
            <div className="transition-all duration-500 ease-out transform rounded-2xl bg-white border border-gray-100">
              <CoursesSmallCard
                image={course.img}
                courseName={course.courseDetails}
                actualPrice={course.actualprice}
                previousPrice={course.amount}
                discount={course.percent}
                courseId={course.id || course._id}
              />
            </div>
          </SwiperSlide>
        ))
      ) : (
        <SwiperSlide>
          <div className="flex justify-center items-center h-40 text-gray-500">
            {loading
              ? "Loading courses..."
              : error
              ? "Failed to load courses."
              : "No courses available."}
          </div>
        </SwiperSlide>
      )}
    </Swiper>
  );

  return (
    <section
      className={`w-full py-2 ${
        title ? "bg-gradient-to-b from-[#f9fbff] to-white" : "bg-white"
      }`}
    >
      <div
        className={`${
          title
            ? "overflow-y-auto max-h-[95vh] shadow-2xl py-2 custom-scrollbar rounded-2xl"
            : ""
        } max-w-7xl mx-auto px-3`}
      >
        {title ? (
          <div
            className="flex flex-col items-center justify-start gap-1 text-center relative"
            style={{
              backgroundImage: `url('/Ellipse1.svg')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "left center",
            }}
          >
            {/* Sticky Header for Sidebar */}
            <div className="sticky top-0 z-20 w-full backdrop-blur-sm py-1 flex flex-col items-center gap-2">
              <h2 className="text-2xl font-bold text-[var(--primary-color)] leading-snug">
                Courses You May Like!
              </h2>
              <p className="text-gray-600 text-sm md:text-base max-w-lg">
                Scroll through batches designed for your growth.
              </p>
              <div className="w-16 h-1 bg-[var(--primary-color)] rounded-full"></div>
            </div>

            {/* Vertical Swiper */}
            <div className="w-full">{renderCarousel()}</div>
          </div>
        ) : (
          <>
            {/* Horizontal Layout for homepage */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
                Courses You Might Like
              </h2>
              <p className="text-gray-500 mt-2 text-sm md:text-base">
                Scroll through curated batches for your success
              </p>
              <div className="w-16 h-1 bg-[var(--primary-color)] rounded-full mx-auto mt-3"></div>
            </div>
            {renderCarousel()}
          </>
        )}
      </div>
    </section>
  );
};

export default CoursesYouLike;
