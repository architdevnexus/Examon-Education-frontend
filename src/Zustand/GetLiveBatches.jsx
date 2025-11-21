// src/Zustand/useBatchesStore.js
import { create } from "zustand";
import axios from "axios";

export const useBatchesStore = create((set) => ({
  loading: false,
  error: null,
  batchData: [],

  fetchBatches: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("http://194.238.18.1:3004/api/live/batches");
      const categories = response.data?.categories || [];

      // Flatten all batches with their category name
      const flattened = categories.flatMap((category) =>
        category.batches.map((batch) => ({
          ...batch,
          categoryName: category.batchCategory,
        }))
      );

      set({ batchData: flattened, loading: false });
    } catch (error) {
      console.error("Error fetching batches:", error);
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch batches. Please try again.",
        loading: false,
      });
    }
  },
}));
