// src/Zustand/useBatchesStore.js
import { create } from "zustand";
import axios from "axios";

export const useBatchesStore = create((set, get) => ({
  loading: false,
  error: null,
  batchData: [],
  hasFetched: false, // ✅ added

  fetchBatches: async () => {
    // ✅ prevent duplicate calls
    if (get().hasFetched) return;

    set({ loading: true, error: null });

    try {
      const response = await axios.get(
        "https://backend.mastersaab.co.in/api/live/batches"
      );

      const categories = response.data?.categories || [];

      const flattened = categories.flatMap((category) =>
        category.batches.map((batch) => ({
          ...batch,
          categoryName: category.batchCategory,
        }))
      );

      set({
        batchData: flattened,
        loading: false,
        hasFetched: true, // ✅ mark fetched
      });
    } catch (error) {
      console.error("Error fetching batches:", error);

      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch batches. Please try again.",
        loading: false,
        hasFetched: false, // allow retry
      });
    }
  },
}));
