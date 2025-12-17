import React, { useEffect, useState } from "react";
import axios from "axios";
import { useBatchesStore } from "../../Zustand/GetLiveBatches";
import { useAuthStore } from "../../Zustand/UserData";
import { useProfileData } from "../../Zustand/GetuseProfile";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar } from "react-icons/fa";

export const ReviewSection = () => {
  const { batchData = [], fetchBatches } = useBatchesStore();
  const { userData, fetchUserProfile } = useProfileData();
  const { user, token, isAuthenticated } = useAuthStore();

  const [selectedBatch, setSelectedBatch] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch batches & user profile on mount
  useEffect(() => {
    fetchBatches?.();
    fetchUserProfile?.();
  }, [fetchBatches, fetchUserProfile]);

  // Handle review submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !token) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    if (!selectedBatch) {
      toast.error("Please select a batch.");
      return;
    }

    if (rating === 0) {
      toast.error("Please provide a rating.");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review.");
      return;
    }

    try {
      setLoading(true);

      const reviewPayload = {
        clientname: user?.name || userData?.[0]?.fullname || "",
        profilePicture: userData?.[0]?.profileImage || "",
        batch: selectedBatch,
        star: rating,
        review: reviewText.trim(),
      };

      await axios.post(
        "https://backend.mastersaab.co.in/api/review/create",
        reviewPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Review submitted successfully!");
      setSelectedBatch("");
      setRating(0);
      setReviewText("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white shadow-md rounded-2xl p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Leave a Review</h2>

      {/* Batch Dropdown */}
      <label className="block mb-2 font-medium text-gray-700">Select Batch</label>
      <select
        value={selectedBatch}
        onChange={(e) => setSelectedBatch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring focus:ring-indigo-200"
      >
        <option value="">-- Choose a batch --</option>
        {batchData?.map((batch) => (
          <option key={batch._id} value={batch.batchName}>
            {batch.batchName}
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
                size={28}
                className="cursor-pointer transition-colors"
                color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
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
        rows={4}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:ring-indigo-200"
      />
      <div className="text-right text-sm text-gray-500 mb-3">{reviewText.length}/300</div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full bg-[var(--primary-color)] text-white py-2 rounded-lg hover:bg-indigo-700 transition ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};
