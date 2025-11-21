import React, { useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { useMentorStore } from "../../Zustand/GetMentor";
import { useCourseStore } from "../../Zustand/GetAllCourses";
import { useParams } from "react-router-dom";

const MeetYourMentor = () => {
  const { courseId } = useParams();
  const { loading, error, mentorData, fetchMentors } = useMentorStore();
  const { data: courses, fetchCourses } = useCourseStore();

  // Fetch mentors and courses on mount
  useEffect(() => {
    fetchMentors();
    fetchCourses();
  }, [fetchMentors, fetchCourses]);

  // Find the current course
  const currentCourse = useMemo(() => {
    if (!Array.isArray(courses)) return null;
    return courses.find((c) => String(c.id || c._id) === String(courseId));
  }, [courses, courseId]);

  // Filter mentors who handle this course
  const mentorsForCourse = useMemo(() => {
    if (!Array.isArray(mentorData) || !currentCourse) return [];
    return mentorData.filter((mentor) =>
      Array.isArray(mentor.CoursesHandled)
        ? mentor.CoursesHandled.includes(currentCourse.id || currentCourse._id)
        : false
    );
  }, [mentorData, currentCourse]);

  if (!currentCourse) return null; // course not found

  return (
    <section className="w-full bg-white flex flex-col items-center justify-center">
      <div className="max-w-full w-full mx-auto flex flex-col items-center justify-center px-6 md:px-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary-color)] mb-12">
          Meet Your Mentors
        </h2>

        {mentorsForCourse.length === 0 && (
          <p className="text-gray-500 text-center mb-8">
            No mentors assigned for this course yet.
          </p>
        )}

        {mentorsForCourse.length > 0 && (
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={false}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            className="w-full"
          >
            {mentorsForCourse.map((mentor) => (
              <SwiperSlide key={mentor._id || mentor.id}>
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-20 w-full">
                  {/* Left Content */}
                  <div className="w-full md:w-1/2 flex flex-col items-start text-left md:pl-6">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#111827] uppercase tracking-wide mb-3">
                      {mentor.name}
                    </h3>
                    {mentor.designation && (
                      <p className="text-base md:text-lg text-gray-700 font-medium mb-1">
                        {mentor.designation}
                      </p>
                    )}
                    {mentor.experience && (
                      <p className="text-sm md:text-base text-gray-600 mb-5 leading-relaxed">
                        {mentor.experience}
                      </p>
                    )}

                    {/* Social Links */}
                    <div className="flex items-center gap-4 mt-2">
                      {mentor.linkedin && (
                        <a
                          href={mentor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--primary-color)] bg-gray-100 p-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 text-2xl"
                        >
                          <FaLinkedin />
                        </a>
                      )}
                      {mentor.instagram && (
                        <a
                          href={mentor.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--primary-color)] bg-gray-100 p-2 rounded-full hover:bg-pink-50 hover:text-pink-600 transition-all duration-300 text-2xl"
                        >
                          <FaInstagram />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Image Section */}
                  <div className="relative w-full md:w-1/2 flex items-center justify-center">
                    <div
                      className="w-full h-72 md:h-96 flex items-center justify-center"
                      style={{
                        backgroundImage: "url('/Group.svg')",
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    >
                      <img
                        src={mentor.imageUrl || mentor.image}
                        alt={mentor.name}
                        className="w-80 md:mb-28 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default MeetYourMentor;
