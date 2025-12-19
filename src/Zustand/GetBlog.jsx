import { create } from "zustand";
import axios from "axios";

const API_BASE = "https://backend.mastersaab.co.in/api";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useBlogStore = create((set, get) => ({
  blogData: [],
  loading: false,
  error: null,
  hasFetched: false, // ✅ cache flag

  fetchBlogs: async () => {
    const { loading, hasFetched } = get();

    // ✅ Prevent duplicate or infinite calls
    if (loading || hasFetched) return;

    set({ loading: true, error: null });

    try {
      const { data } = await axios.get(`${API_BASE}/blogs`);

      set({
        blogData:data ? data : [],
        loading: false,
        hasFetched: true,
      });
    } catch (error) {
      console.error("Fetch Blog Error:", error);

      set({
        error:
          error?.response?.data?.message || "Failed to fetch blogs.",
        loading: false,
        hasFetched: false,
      });
    }
  },
}));
