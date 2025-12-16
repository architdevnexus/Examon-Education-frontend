import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCourseStore } from "../../Zustand/GetAllCourses";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar } from "react-icons/fa";
import { useAuthStore } from "../../Zustand/UserData";
import { useProfileData } from "../../Zustand/GetuseProfile"

export const ReviewSection = () => {
  const { data: coursesData = [], fetchCourses } = useCourseStore();
  const { userData, error, fetchUserProfile } = useProfileData();
  const { user, token, isAuthenticated } = useAuthStore();

  const [selectedCourse, setSelectedCourse] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all courses
  useEffect(() => {
    fetchCourses();
    fetchUserProfile();
  }, [fetchCourses, fetchUserProfile]);

  console.log(userData)

  // ===========================
  // HANDLE SUBMIT REVIEW
  // ===========================
  const Data = JSON.parse(localStorage.getItem('token'))
  console.log()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Data?.state?.token

    if (!token) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    if (!selectedCourse) {
      toast.error("Please select a course.");
      return;
    }

    if (rating === 0) {
      toast.error("Please provide a rating.");
      return;
    }

    if (reviewText.trim().length === 0) {
      toast.error("Please write a review.");
      return;
    }

    try {
      setLoading(true);

      const reviewPayload = {
        clientname: Data?.state?.name,
        profilePicture: userData?.[0]?.profileImage || "",
        course: userData?.[0]?.preferedCourse || "",
        star: rating,
        review: reviewText,
      };

      console.log("Submitting review:", reviewPayload);

      await axios.post(
        "https://backend.mastersaab.co.in/review/create",
        reviewPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Review submitted successfully!");
      setSelectedCourse("");
      setRating(0);
      setReviewText("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <div className="max-w-full mx-auto bg-white shadow-md rounded-2xl p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Leave a Review</h2>

      {/* Course Dropdown */}
      <label className="block mb-2 font-medium text-gray-700">
        Select Course
      </label>
      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring focus:ring-indigo-200"
      >
        <option value="">-- Choose a course --</option>
        {coursesData?.map((course) => (
          <option key={course._id || course.id} value={course._id || course.id}>
            {course.courseDetails || course.name}
          </option>
        ))}
      </select>

      {/* Star Rating */}
      <div className="flex text-[var(--primary-color)] items-center mb-4">
        {[...Array(5)].map((_, index) => {
          const currentRating = index + 1;
          return (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={currentRating}
                onClick={() => setRating(currentRating)}
                className="hidden"
              />
              <FaStar
                className="cursor-pointer transition-colors"
                size={28}
                color={
                  currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                }
                onMouseEnter={() => setHover(currentRating)}
                onMouseLeave={() => setHover(null)}
              />
            </label>
          );
        })}
      </div>

      {/* Review Textarea */}
      <textarea
        value={reviewText}
        onChange={(e) => {
          if (e.target.value.length <= 300) setReviewText(e.target.value);
        }}
        placeholder="Write your review (max 300 characters)..."
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:ring-indigo-200"
        rows="4"
      ></textarea>
      <div className="text-right text-sm text-gray-500 mb-3">
        {reviewText.length}/300
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full bg-[var(--primary-color)] text-white py-2 rounded-lg hover:bg-indigo-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};
