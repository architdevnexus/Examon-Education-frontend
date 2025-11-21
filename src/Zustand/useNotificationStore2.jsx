import { create } from "zustand";
import { socket } from "../socket";

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
      console.log("⚠️ Listeners already attached");
      return;
    }

    set({ listenersAttached: true });

    console.log("📡 Fetching initial notifications from API...");

    try {
      const res = await fetch("http://194.238.18.1:3004/api/notification/latest");
      const json = await res.json();

      console.log("📦 API Notifications:", json.data);

      set({ popnotifications: json.data });
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

    socket.on("new_notification", (data) => {
      console.log("🔥 NEW LIVE POPUP:", data);
      get().addPopupNotification(data); // auto add to popup
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket Disconnected");
      set({ socketConnected: false });
    });
  },
}));
