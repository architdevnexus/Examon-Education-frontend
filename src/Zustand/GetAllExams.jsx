import { create } from "zustand";
import axios from "axios";

export const useExamStore = create((set) => ({
  exams: [],
  loading: false,
  error: null,

  /** Fetch all exams */
  fetchAllExams: async () => {
    set({ loading: true, error: null });

    try {
      const res = await axios.get("https://backend.palgharhome.com/api/exams/details");

      // Since response is an array, directly store it
      set({ exams: res.data || [], loading: false });
    } catch (err) {
      console.error("Error fetching exams:", err);
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },
}));
