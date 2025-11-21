import {create} from "zustand";
import axios from "axios";

export const useNewsStore = create((set) => ({
    news: [],
    loading: false,
    error: null,
    fetchNews: async () => {
        set({loading: true, error: null});
        try {
            const response = await axios.get("http://194.238.18.1:3004/api/news/all");
            set({news: response.data, loading: false});
        }
        catch (error) {
            set({error: error.message, loading: false});
        }
    },
    clearNews: () => set({news: []}),
}));