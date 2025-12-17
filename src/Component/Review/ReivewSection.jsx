import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaStar } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

import { useBatchesStore } from "../../Zustand/GetLiveBatches";
import { useAuthStore } from "../../Zustand/UserData";
import { useProfileData } from "../../Zustand/GetuseProfile";

export const ReviewSection = () => {
  const { batchData = [], fetchBatches } = useBatchesStore();
  const { userData, fetchUserProfile } = useProfileData();
  const { token, isAuthenticated } = useAuthStore();

  const [selectedBatch, setSelectedBatch] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetchBatches?.();
    fetchUserProfile?.();
  }, [fetchBatches, fetchUserProfile]);

  /* ---------------- DERIVED VALUES ---------------- */
  const userName = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("token"))?.state?.name || "Anonymous";
    } catch {
      return "Anonymous";
    }
  }, []);

  const profileImage = userData?.[0]?.profileImage || "";

  /* ---------------- HANDLERS ---------------- */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isAuthenticated || !token) {
        toast.error("You must be logged in to submit a review.");
        return;
      }

      if (!selectedBatch) {
        toast.error("Please select a batch.");
        return;
      }

      if (!rating) {
        toast.error("Please provide a rating.");
        return;
      }

      if (!reviewText.trim()) {
        toast.error("Please write a review.");
        return;
      }

      try {
        setLoading(true);

        const payload = {
          clientname: userName,
          profilePicture: profileImage,
          batch: selectedBatch,
          star: rating,
          review: reviewText.trim(),
        };
      
        await axios.post(
          "https://backend.mastersaab.co.in/api/review/create",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Review submitted successfully!");

        // Reset form
        setSelectedBatch("");
        setRating(0);
        setReviewText("");
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to submit review."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      isAuthenticated,
      token,
      selectedBatch,
      rating,
      reviewText,
      userName,
      profileImage,
    ]
  );

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-full mx-auto bg-white shadow-md rounded-2xl p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Leave a Review
      </h2>

      {/* Batch Dropdown */}
      <label className="block mb-2 font-medium text-gray-700">
        Select Batch
      </label>
      <select
        value={selectedBatch}
        onChange={(e) => setSelectedBatch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring focus:ring-indigo-200"
      >
        <option value="">-- Choose a batch --</option>
        {batchData.map((batch) => (
          <option key={batch._id} value={batch.batchName}>
            {batch.batchName}
          </option>
        ))}
      </select>

      {/* Star Rating */}
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={`Rate ${value} star`}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(null)}
            className="cursor-pointer"
          >
            <FaStar
              size={28}
              color={value <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              className="transition-colors"
            />
          </button>
        ))}
      </div>

      {/* Review Textarea */}
      <textarea
        value={reviewText}
        onChange={(e) =>
          e.target.value.length <= 300 && setReviewText(e.target.value)
        }
        placeholder="Write your review (max 300 characters)..."
        rows={4}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:ring-indigo-200"
      />
      <div className="text-right text-sm text-gray-500 mb-3">
        {reviewText.length}/300
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full bg-[var(--primary-color)] text-white py-2 rounded-lg transition ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"
          }`}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};
