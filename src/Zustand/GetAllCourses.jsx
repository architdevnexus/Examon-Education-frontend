// src/Zustand/GetAllCourses.js
import { create } from "zustand";
import axios from "axios";

const API_BASE = "https://backend.mastersaab.co.in/api";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

export const useCourseStore = create((set, get) => ({
  // --- STATE ---
  data: [],
  categories: [],
  selectedCategory: "All",
  currentPage: 1,
  totalPages: 1,
  perPage: 8,
  loading: false,
  error: null,
  cart: JSON.parse(localStorage.getItem("cart")) || [], // persist cart

  // --- FETCH COURSES ---
  fetchCourses: async () => {
    if (get().data.length > 0) return; // avoid refetch if already cached

    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_BASE}/course/all`);
      const apiData = response.data;

      // Flatten nested structure
      const formattedCourses = apiData.data.flatMap((category) =>
        category.courses.map((course) => ({
          id: course._id,
          img: course.img,
          actualprice: course.actualprice,
          previousprice: course.previousprice,
          discountPercent: course.discountPercent,
          courseDetails: course.title,
          insideCourses: course.insideCourses,
          perks: course.perks,
          percent: course.percent,
          amount: course.amount,
          examCategory: category.examCategory,
        }))
      );

      const categories = ["All", ...apiData.data.map((c) => c.examCategory)];

      set({
        data: formattedCourses,
        categories,
        loading: false,
        totalPages: Math.ceil(formattedCourses.length / get().perPage),
      });
    } catch (err) {
      console.error("Fetch courses failed:", err);
      set({
        error:
          err.response?.data?.message ||
          "Failed to fetch courses. Please try again.",
        loading: false,
      });
    }
  },

  // --- FILTER BY CATEGORY ---
  fetchCoursesByCategory: (category) => {
    const { data, perPage } = get();
    const filtered =
      category === "All"
        ? data
        : data.filter((c) => c.examCategory === category);

    set({
      selectedCategory: category,
      totalPages: Math.ceil(filtered.length / perPage),
      currentPage: 1,
    });
  },

  // --- PAGINATION ---
  setPage: (page) => {
    const { totalPages } = get();
    if (page >= 1 && page <= totalPages) set({ currentPage: page });
  },
  // --- ADD TO CART ---
addToCart: (course) => {
  if (!course || !course.id) {
    console.error("Invalid course data");
    return;
  }

  const { cart } = get();

  const exists = cart.some((item) => item.id === course.id);
  if (exists) return;

  const cartItem = {
    // IDs
    id: course.id,
    categoryName: course.examCategory,

    // Display
    title: course.courseDetails,
    image: course.img,
    
    // Pricing (✅ FIXED)
    price: course.actualprice,
    previousprice: course.previousprice,
    discount: course.amount || 0,                // ✅ WORKS
    discountPercent: course.discountPercent || 0, // ✅ WORKS

    // Academic
    perks: course.perks,
    insideCourses: course.insideCourses,

    // Meta
    addedAt: Date.now(),
  };

  const updatedCart = [...cart, cartItem];
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  set({ cart: updatedCart });
},




  // --- REMOVE FROM CART ---
  removeFromCart: (courseId) => {
    const { cart } = get();
    const updatedCart = cart.filter((item) => item.id !== courseId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    set({ cart: updatedCart });
  },

  // --- CLEAR CART ---
  clearCart: () => {
    localStorage.removeItem("cart");
    set({ cart: [] });
  },

  // --- RESET ALL COURSES ---
  resetCourses: () =>
    set({
      data: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      selectedCategory: "All",
    }),
}));
