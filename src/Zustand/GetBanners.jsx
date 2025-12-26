import { create } from "zustand";
import axios from "axios";

const BASE_API_URL = "https://backend.mastersaab.co.in/api/banners/all";

export const useBanners = create((set) => ({
  banners: [],
  loading: false,
  error: null,

  fetchBanners: async () => {
    set({ loading: true, error: null });

    try {
      const res = await axios.get(BASE_API_URL);

      set({
        banners: res?.data?.banners, // Axios gives parsed data
        loading: false,
      });
      console.log(banners)
    } catch (error) {
      console.error("Error fetching banners:", error);

      set({
        error: error.message || "Failed to fetch banners",
        loading: false,
      });
    }
  },
}));
