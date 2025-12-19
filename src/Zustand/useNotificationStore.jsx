import { create } from "zustand";
import { getSocket } from "../socket";

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
    try {
      console.log("📡 Fetching initial notifications...");
      const res = await fetch(
        "https://backend.mastersaab.co.in/api/notifications/discount/latest"
      );
      const json = await res.json();

      set({ notifications: json.data || [] });
    } catch (error) {
      console.error("❌ API Fetch Error:", error);
    }

    // --------------------------
    // STEP 2: Init Socket (CORRECT)
    // --------------------------
    const socket = getSocket(); // ✅ SINGLETON

    if (!socket.connected) {
      socket.connect();
    }

    socket.off(); // 🔥 prevents duplicate listeners

    socket.on("connect", () => {
      console.log("⚡ Socket connected:", socket.id);
      set({ socketConnected: true });
    });

    socket.on("new_notification", (data) => {
      console.log("🔥 NEW LIVE NOTIFICATION:", data);
      set((state) => ({
        notifications: [data, ...state.notifications],
      }));
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      set({ socketConnected: false });
    });
  },
}));
