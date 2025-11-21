import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, // full user object (kept in memory only)
      token: null,
      userId: null,
      name: null,
      email: null,
      isAuthenticated: false,

      /** ✅ Login — stores user in memory and basic info in localStorage */
      login: (user, token) => {
        set({
          user,
          token,
          userId: user?._id || null,
          name: user?.fullname || user?.fullName || null,
          email: user?.email || null,
          isAuthenticated: Boolean(token),
        });
      },

      /** ✅ Update user info — memory only */
      updateUser: (updates) => {
        const current = get().user || {};
        const updated = { ...current, ...updates };
        if (JSON.stringify(current) !== JSON.stringify(updated)) {
          set({ user: updated });
        }
      },

      /** ✅ Logout — clear both memory and localStorage */
      logout: () => {
        set({
          user: null,
          token: null,
          userId: null,
          name: null,
          email: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("token"); // remove persisted data
      },
    }),
    {
      name: "token", // 🔑 localStorage key name
      storage: createJSONStorage(() => localStorage),

      /** ✅ Persist only the required fields */
      partialize: (state) => ({
        token: state.token,
        userId: state.userId,
        name: state.name,
        email: state.email,
      }),

      /** ✅ On app reload, recheck authentication */
      onRehydrateStorage: () => (state) => {
        const token = state?.token || null;
        state.isAuthenticated = Boolean(token);
      },
    }
  )
);
