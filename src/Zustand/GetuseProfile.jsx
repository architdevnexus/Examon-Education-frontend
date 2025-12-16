import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./UserData"; // adjust path if needed

export const useProfileData = create((set, get) => ({
  userData: null,
  loading: false,
  error: null,

  /**  Fetch user profile from API using stored token and userId */
  fetchUserProfile: async () => {
    try {
      set({ loading: true, error: null });
      const tokens = JSON.parse(localStorage.getItem("token"))?.state?.token;
      // Get token & userId from auth store
      const { token, userId } = useAuthStore.getState();
      if (!token || !userId) {
        throw new Error("Missing authentication details");
      }

      //  Fetch user data
      const response = await axios.get(
        `https://backend.mastersaab.co.in//profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({ userData: response?.data?.data, loading: false });
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      set({
        error:
          error.response?.data?.message ||
          "Failed to fetch user profile. Please try again.",
        loading: false,
      });
    }
  },
}));
