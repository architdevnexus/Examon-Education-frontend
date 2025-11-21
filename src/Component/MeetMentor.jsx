import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useMentorStore } from "../Zustand/GetMentor";

/**
 * MeetMentor Component
 * Displays mentors fetched from backend in a beautiful Swiper carousel.
 * Includes error handling, loading states, and responsive layout.
 */
const MeetMentor = () => {
  const { loading, error, mentorData, fetchMentors } = useMentorStore();

  // Fetch mentors when component mounts
  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);
  return (
    <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
        {/* ===== Header Section ===== */}
        <div className="text-center md:text-right md:order-2 md:w-1/3">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700">
            Meet Our
          </h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-[var(--primary-color)] leading-tight">
            Mentors
          </h3>
        </div>

        {/* ===== Carousel Section ===== */}
        <div className="w-full md:max-w-4xl">
          {loading ? (
            <div className="flex justify-center items-center h-60 text-gray-600">
              <span className="animate-pulse">Loading mentors...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 font-medium">
              Failed to load mentors. Please try again later.
            </div>
          ) : mentorData?.length > 0 ? (
            <Swiper
              modules={[Pagination, Autoplay]}
              slidesPerView={1}
              spaceBetween={40}
              loop
              speed={800}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              className="w-full"
            >
              {mentorData.map((mentor) => (
                <SwiperSlide key={mentor._id}>
                  <div className="relative flex flex-col md:flex-row items-center bg-white rounded-3xl shadow-lg overflow-hidden border-4 border-gray-100">
                    {/* Background Decorative Layer */}
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-[var(--primary-color)]/10 via-transparent to-transparent z-0"
                      style={{
                        backgroundImage: "url('/Group.svg')",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        opacity: 0.4,
                      }}
                    ></div>

                    {/* Mentor Image */}
                    <div className="relative flex justify-center items-center w-full md:w-1/2 p-6 z-10">
                      <img
                        src={mentor.imageUrl || "/default-avatar.png"}
                        alt={mentor.name}
                        className="relative w-64 h-72 md:w-80 md:h-80 object-cover rounded-2xl shadow-md"
                        loading="lazy"
                      />
                    </div>

                    {/* Mentor Information */}
                    <div className="relative flex flex-col justify-center gap-4 text-gray-800 p-6 md:p-8 w-full md:w-1/2 z-10">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                          {mentor.name || "Unknown"}
                        </h3>
                        <p className="text-base font-medium text-[var(--primary-color)]">
                          {mentor.designation || "Mentor"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {mentor.experience
                            ? `${mentor.experience} years of experience`
                            : "Experience not specified"}
                        </p>
                      </div>

                      <div className="mt-2 space-y-2">
                        <p className="text-sm italic">
                          Specialization:{" "}
                          <span className="font-medium text-gray-800">
                            {mentor.specialization || "N/A"}
                          </span>
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          {mentor.linkedin && (
                            <a
                              href={mentor.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm  bg-gray-300 px-5 py-2 rounded-full transition"
                            >
                              LinkedIn
                            </a>
                          )}
                          {mentor.coursesLink && (
                            <a
                              href={mentor.coursesLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[var(--primary-color)] border border-[var(--primary-color)] px-5 py-2 rounded-full  hover:text-white transition"
                            >
                              View Courses
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center text-gray-500">
              No mentors available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MeetMentor;
