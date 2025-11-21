import { create } from "zustand";
import axios from "axios";

const API_BASE = "http://194.238.18.1:3004/api";

export const useNotesStore = create((set) => ({
  notesData: [],
  loading: false,
  error: null,

  // ✅ Fetch all notes
  fetchNotes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE}/notes/all`);
      if (response.data?.success && Array.isArray(response.data.data)) {
        set({ notesData: response.data.data, loading: false });
      } else {
        set({ error: "Invalid response format", loading: false });
      }
    } catch (error) {
      console.error("Fetch Notes Error:", error);
      set({
        error:
          error.response?.data?.message ||
          "Unable to fetch notes. Please try again later.",
        loading: false,
      });
    }
  },
}));
