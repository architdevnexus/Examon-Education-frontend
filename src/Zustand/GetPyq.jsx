// src/Zustand/usePyqStore.js
import { create } from "zustand";
import axios from "axios";

/**
 * Zustand store for managing PYQ (Previous Year Questions) data.
 * Handles loading, error states, and async fetching with Axios.
 */
export const usePyqStore = create((set, get) => ({
    // --- State ---
    pyqData: [],
    loading: false,
    error: null,

    // --- Actions ---
    fetchPyq: async () => {
        // Avoid duplicate requests
        if (get().loading) return;

        set({ loading: true, error: null });

        try {
            const response = await axios.get("http://194.238.18.1:3004/api/pyq");

            // Validate response data structure
            if (response.status === 200 ) {
                set({ pyqData: response?.data?.data });
            } else {
                throw new Error("Invalid data format received from server.");
            }
        } catch (error) {
            console.error("PYQ Fetch Error:", error);
            set({ error: error.message || "Failed to fetch PYQ data" });
        } finally {
            set({ loading: false });
        }
    },

    // Optional: manual setter to clear data
    clearPyqData: () => set({ pyqData: [], error: null }),
}));
