import { create } from "zustand";
import axios from "axios";

export const useHomeQuiz = create((set) => ({
  data: [],
  loading: false,
  error: null,

  //  Fetch Home Quiz Data
  fetchHomeQuiz: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get("http://194.238.18.1:3004/api/home/quizzes");

      // Assuming the API returns { quizzes: [...] }
      set({ data: data || data, loading: false });
    } catch (error) {
      console.error("Error fetching home quiz:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch home quiz data",
        loading: false,
      });
    }
  },
}));
