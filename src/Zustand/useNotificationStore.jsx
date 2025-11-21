import { create } from "zustand";
import { socket } from "../socket";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  socketConnected: false,
  listenersAttached: false,

  initSocket: async () => {
    if (get().listenersAttached) {
      console.log("⚠️ Listeners already attached");
      return;
    }

    set({ listenersAttached: true });

    // --------------------------
    // STEP 1: Fetch Initial Data
    // --------------------------
    console.log("📡 Fetching initial notifications from API...");

    try {
      const res = await fetch("http://194.238.18.1:3004/api/notifications/discount/latest");
      console.log(res)
      const json = await res.json();

      console.log("📦 API Notifications:", json.data);

      set({ notifications: json.data });
    } catch (error) {
      console.log("❌ API Fetch Error:", error);
    }

    // --------------------------
    // STEP 2: Init Socket
    // --------------------------
    socket.on("connect", () => {
      console.log("⚡ Socket connected:", socket.id);
      set({ socketConnected: true });
    });

    // LISTEN FOR LIVE UPDATES
    socket.on("new_notification", (data) => {
      console.log("🔥 NEW LIVE NOTIFICATION:", data);
      set((state) => ({
        notifications: [data, ...state.notifications],
      }));
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket Disconnected");
      set({ socketConnected: false });
    });
  },
}));
