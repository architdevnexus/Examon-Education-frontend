// ------------------------------
// useMentorStore.js
// Zustand store for managing mentor data
// Includes: loading, error handling, and API integration with Axios
// ------------------------------

import { create } from "zustand";
import axios from "axios";

// Base API URL (Use HTTPS in production for security)
const API_BASE = "http://194.238.18.1:3004/api";

// Global Axios defaults
axios.defaults.withCredentials = true; // allows cookies (for auth sessions)
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useMentorStore = create((set, get) => ({
  // ------------------------------
  // Initial State
  // ------------------------------
  loading: false, // UI spinner control
  error: null, // to show error messages in UI
  mentorData: [], // fetched mentors list

  // ------------------------------
  // Fetch Mentors (Async)
  // ------------------------------
  fetchMentors: async () => {
    // If already loading, prevent duplicate API calls
    if (get().loading) return;

    // Set loading state before API call
    set({ loading: true, error: null });

    try {
      // Fetch data from backend
      const response = await axios.get(`${API_BASE}/mentors`);

      // Update store with response data
      set({
        mentorData: response.data?.data || [],
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching mentors:", err);

      // Handle network/server errors gracefully
      let message = "Something went wrong. Please try again.";
      if (err.code === "ERR_NETWORK") message = "Network error — check your connection or API URL.";
      else if (err.response)
        message = err.response.data?.message || `Server error (${err.response.status})`;

      set({
        error: message,
        loading: false,
      });
    }
  },

  // ------------------------------
  // Optional: Refresh function (force refetch)
  // ------------------------------
  refreshMentors: async () => {
    // clear cache and fetch again
    set({ mentorData: [] });
    await get().fetchMentors();
  },
}));
