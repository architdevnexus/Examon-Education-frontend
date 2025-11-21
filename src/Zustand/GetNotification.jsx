import { create } from "zustand";

export const useNotificationStores = create((set, get) => ({
  // ================================
  // 🔹 States
  // ================================
  notifications: [], // Queue of unread notifications
  loading: false,
  error: null,
  lastSeenId: null, // last seen _id from DB

  // ================================
  // 🔹 Fetch Latest Notification
  // ================================
  fetchNotifications: async (endpoint) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to fetch notification");

      const result = await response.json();

      // API returns only a SINGLE "data" object
      const newNotification = result?.data;

      if (!newNotification?._id) {
        set({ loading: false });
        return;
      }

      const { lastSeenId } = get();

      // Skip if already seen
      if (lastSeenId === newNotification._id) {
        set({ loading: false });
        return;
      }

      // Add new notification to queue
      set((state) => ({
        notifications: [...state.notifications, newNotification],
        lastSeenId: newNotification._id,
      }));

      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // ================================
  // 🔹 Remove displayed notification
  // ================================
  removeNotification: () => {
    const queue = get().notifications;
    set({ notifications: queue.slice(1) });
  },
}));
