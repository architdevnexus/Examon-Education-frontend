import { create } from "zustand";
import { getSocket } from "../socket";

export const useNotificationStore2 = create((set, get) => ({
  popnotifications: [],
  socketConnected: false,
  listenersAttached: false,

  addPopupNotification: (data) =>
    set((state) => ({
      popnotifications: [data, ...state.popnotifications],
    })),

  initSocket: async () => {
    if (get().listenersAttached) {
      // console.log("⚠️ Listeners already attached");
      return;
    }

    set({ listenersAttached: true });

    // --------------------------
    // STEP 1: Fetch Initial Data
    // --------------------------
    try {
      // console.log("📡 Fetching popup notifications...");
      const res = await fetch(
        "https://backend.mastersaab.co.in/api/notification/latest"
      );
      const json = await res.json();
      set({ popnotifications: json.data || [] });
    } catch (error) {
      console.error("❌ API Fetch Error:", error);
    }

    // --------------------------
    // STEP 2: Init Socket (CORRECT WAY)
    // --------------------------
    const socket = getSocket();   // ✅ IMPORTANT

    if (!socket.connected) {
      socket.connect();
    }

    socket.off(); // 🔥 prevents duplicate listeners

    socket.on("connect", () => {
      // console.log("⚡ Socket connected:", socket.id);
      set({ socketConnected: true });
    });

    socket.on("new_notification", (data) => {
      console.log("🔥 NEW LIVE POPUP:", data);
      get().addPopupNotification(data);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      set({ socketConnected: false });
    });
  },
}));
