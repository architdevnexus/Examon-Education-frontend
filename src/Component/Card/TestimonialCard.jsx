import React, { useEffect, useMemo } from "react";
import { CiStar } from "react-icons/ci";
import { FaUserLarge } from "react-icons/fa6";
import { useCourseStore } from "../../Zustand/GetAllCourses";
import { useProfileData } from "../../Zustand/GetuseProfile";

const TestimonialCard = ({ img, name, exam, date, star = 5, review }) => {
  const { data, fetchCourses } = useCourseStore();
  const { userData, fetchUserProfile } = useProfileData();

  // Fetch once
  useEffect(() => {
    fetchCourses();
    fetchUserProfile();
  }, [fetchCourses, fetchUserProfile]);

  /** ------------------------------------------------
   *   Optimized memo values (no re-renders)
   * ------------------------------------------------ */
  const { displayName, displayReview, displayCourse } = useMemo(() => {
    const truncatedReview = review?.length > 200 
      ? review.substring(0, 200) + "..." 
      : review;

    const courseName =
      data?.[0]?.courseDetails || exam || "Unknown Course";

    return {
      displayName: name || userData?.fullName || "Anonymous",
      displayReview: truncatedReview || "No review text provided.",
      displayCourse: courseName,
    };
  }, [review, name, exam, data, userData]);

  return (
    <div className="relative bg-[#003E68] text-white rounded-xl px-6 py-3 flex flex-col justify-between gap-4 shadow-xl hover:shadow-2xl transition-all duration-300 w-full max-w-md h-80 mx-auto">

      {/* Decorative Circles */}
      <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#3498DB] rounded-full opacity-30 z-0"></div>
      <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#3498DB] rounded-full opacity-20 z-0"></div>

      {/* Top Section */}
      <div className="flex items-center justify-between z-10 relative">
        {img ? (
          <img
            src={img}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <FaUserLarge className="w-8 h-8 text-white mt-2" />
        )}

        <div className="flex gap-1">
          {Array.from({ length: star }).map((_, i) => (
            <CiStar key={i} className="w-5 h-5 text-white" />
          ))}
        </div>
      </div>

      {/* Review Content */}
      <div className="flex flex-col gap-2 z-10 relative">
        <img src="/double.svg" alt="quote" className="w-6 h-6" />
        <p className="text-sm italic leading-relaxed line-clamp-4">
          {displayReview}
        </p>
      </div>

      {/* Footer */}
      <div className="border-l-2 border-white/30 pl-3 flex flex-col gap-1 z-10 relative">
        <span className="font-semibold text-lg">{displayName}</span>
        <span className="text-sm">{displayCourse}</span>
        <span className="text-xs opacity-80">{date || "N/A"}</span>
      </div>
    </div>
  );
};

export default TestimonialCard;
