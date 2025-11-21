import { create } from "zustand";
import axios from "axios";

const API_BASE = "http://194.238.18.1:3004/api";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useAllQuiz = create((set) => ({
  quizData: [],
  loading: false,
  error: null,

  fetchQuiz: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_BASE}/quizzes`);
      //  Adjusting data shape
      set({ quizData: data.quizzes || [], loading: false });
    } catch (error) {
      console.error(" Fetch Quiz Error:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch quizzes.",
        loading: false,
      });
    }
  },
}));
