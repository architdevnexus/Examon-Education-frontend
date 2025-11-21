import { create } from "zustand";
import axios from "axios";
const base_api_url = 'http://194.238.18.1:3004/api';


export const useAchievementStore = create((set) => ({
    achievements: [],
    loading: false,
    error: null,


    fetchAchievements: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${base_api_url}/achievement/get`);
            set({ achievements: response?.data?.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
}));