import { create } from "zustand";
import axios from "axios";

const API_BASE = "http://194.238.18.1:3004/api";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";
export const useBlogStore = create((set) => ({
    blogData: [],
    loading: false,
    error: null,
    fetchBlogs: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await axios.get(`${API_BASE}/blogs`);
            set({ blogData: data || [], loading: false });
        }
        catch (error) {
            console.error(" Fetch Blog Error:", error);
            set({
                error: error.response?.data?.message || "Failed to fetch blogs.",
                loading: false,
            });
        }
    },
}));