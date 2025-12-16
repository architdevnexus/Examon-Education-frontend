import {create} from "zustand";
import axios from "axios";

export const useNewsStore = create((set) => ({
    news: [],
    loading: false,
    error: null,
    fetchNews: async () => {
        set({loading: true, error: null});
        try {
            const response = await axios.get("https://backend.mastersaab.co.in/news/all");
            set({news: response.data, loading: false});
        }
        catch (error) {
            set({error: error.message, loading: false});
        }
    },
    clearNews: () => set({news: []}),
}));