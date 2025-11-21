import { create } from "zustand";
import axios from "axios";

const API_BASE = "http://194.238.18.1:3004/api";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useReviewStore = create((set) => ({
  loading: false,
  error: null,
  reviewData: [],

  // ✅ Fetch all reviews
  fetchReviews: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE}/review/get`);
      // Ensure we only store the "data" array part
      const reviews = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      set({ reviewData: reviews, loading: false });
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
      set({
        error:
          error.response?.data?.message ||
          "Failed to load reviews. Please try again.",
        loading: false,
      });
    }
  },
}));
