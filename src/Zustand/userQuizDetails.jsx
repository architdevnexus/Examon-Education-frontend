import { create } from "zustand";

export const useQuizStore = create((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchQuiz: async () => {
    try {
      set({ loading: true, error: null });

      // 🔹 Get token + userId from localStorage
      const saved = JSON.parse(localStorage.getItem("token"));
      const token = saved?.state?.token;     // adjust if your structure is different
      const userId = saved?.state?.userId;

      console.log("TOKEN:", token);
      console.log("USER ID:", userId);

      if (!token || !userId) {
        throw new Error("Token or UserId missing from localStorage");
      }

      // 🔹 API call example  
      const response = await fetch(
        `https://backend.mastersaab.co.in/api/user/quizzes/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      console.log("Quiz API Response:", result);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to fetch quiz");
      }

      set({ data: result, loading: false });

    } catch (err) {
      console.error("Quiz Fetch Error:", err);
      set({ loading: false, error: err.message });
    }
  }
}));
