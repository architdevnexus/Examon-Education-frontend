import { create } from "zustand";
import axios from "axios";

/**  Utility: Safe JSON parse for localStorage */
const safeParse = (str) => {
  try {
    return str ? JSON.parse(str) : null;
  } catch {
    console.warn("Invalid JSON in localStorage");
    return null;
  }
};

/**  Base API URL */
const API_BASE = "https://backend.mastersaab.co.in/";

/**  Zustand Auth Store */
export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  initialized: false,

  /**  Initialize auth state from localStorage */
  initialize: () => {
    const stored = safeParse(localStorage.getItem("userData"));
    if (stored?.token && stored?.user) {
      set({
        user: stored.user,
        token: stored.token,
        isAuthenticated: true,
      });
    }
    set({ initialized: true });
  },

  /**  Signin Handler */
  signin: async (credentials) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axios.post(`${API_BASE}/signin`, credentials, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const { token, user, message } = data;
      if (!token || !user) throw new Error("Invalid login response");

      //  Save both token + user in localStorage
      localStorage.setItem("userData", JSON.stringify({ token, user }));

      //  Update Zustand state
      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      window.dispatchEvent(new Event("auth-changed"));

      //  Hard reload to clear stale state & navigate home
      setTimeout(() => {
        window.location.href = "/";
      }, 300);

      return { success: true, message: message || "Login successful" };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      console.error("Login Error:", msg);
      set({ loading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  /**  Signup Handler */
  signup: async (payload) => {
    set({ loading: true, error: null });

    try {
      const { data } = await axios.post(`${API_BASE}/signup`, payload, {
        headers: { "Content-Type": "application/json" },
      });



      const { token, user, data: userData, message } = data;
      const finalUser = user || userData;
      console.log("Final User Data:", finalUser);

      if (!token && !finalUser)
        throw new Error("Invalid signup response: missing token or user");

      // localStorage.setItem("userData", JSON.stringify({ token, user: finalUser }));
      set({ user: finalUser, token, isAuthenticated: true });
      window.dispatchEvent(new Event("auth-changed"));


      set({ loading: false, error: null });
      //  Hard reload to clear stale state & navigate home
      // setTimeout(() => {
      //   window.location.href = "/login";
      // }, 300);
      console.log("Final User Data:", finalUser);
      return { success: true, message: message || "Signup successful" };
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      const msg = err.response?.data?.message || err.message || "Signup failed";
      set({ loading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  /** 🚪 Logout Handler */
  logout: () => {
    localStorage.removeItem("auth");
    //  Reload to reset app state & navigate home
    setTimeout(() => {
      window.location.href = "/";
    }, 300);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
    window.dispatchEvent(new Event("auth-changed"));


  },
}));
