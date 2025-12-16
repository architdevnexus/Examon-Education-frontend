import React, { useState, useCallback, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Axios Instance (optimized)
const api = axios.create({
  baseURL: "https://backend.mastersaab.co.in",
  timeout: 10000,
});

// Debounce function
const debounce = (fn, delay = 400) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Memoized debouncer to avoid re-creation
  const debouncedChangeHandler = useMemo(
    () =>
      debounce((value) => {
        setDebouncedEmail(value);
      }, 400),
    []
  );

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    debouncedChangeHandler(e.target.value);
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!debouncedEmail.trim() || !debouncedEmail.includes("@")) {
        toast.error("Please enter a valid email address!");
        return;
      }

      const token = JSON.parse(localStorage.getItem("token"))?.state?.token;

      if (!token) {
        toast.error("Please log in before subscribing!");
        return;
      }

      setLoading(true);

      try {
        const response = await api.post(
          "/subscribe",
          { email: debouncedEmail.trim() },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response?.data?.success) {
          toast.success("🎉 You’ve successfully subscribed!");
          setEmail("");
          setDebouncedEmail("");
        } else {
          toast.warn("Subscription request received, please check your inbox.");
        }
      } catch (error) {
        console.error("Newsletter error:", error);
        toast.error(
          error.response?.data?.message ||
            (error.code === "ECONNABORTED"
              ? "Request timed out. Try again."
              : "Something went wrong!")
        );
      } finally {
        setLoading(false);
      }
    },
    [debouncedEmail]
  );

  return (
    <section className="bg-[var(--primary-color)] text-white rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 hover:shadow-indigo-300/30">

      {/* Left Icon */}
      <div className="flex-shrink-0">
        {loading ? (
          <div className="w-24 h-24 md:w-28 md:h-28 bg-white/20 animate-pulse rounded-xl" />
        ) : (
          <img
            src="/books.svg"
            alt="Newsletter illustration"
            className="w-24 h-24 md:w-28 md:h-28"
            loading="lazy"
          />
        )}
      </div>

      {/* Middle Text */}
      <div className="flex flex-col md:flex-1 gap-2 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold leading-snug">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-white/80 text-base md:text-lg max-w-lg">
          Stay ahead with the latest news, batches, and study updates.
        </p>
      </div>

      {/* Right: Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto md:w-1/2 mt-3"
      >
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          className="flex-1 p-3 rounded-lg outline-none border border-transparent focus:border-white focus:ring-2 focus:ring-white transition bg-white/90 text-gray-900 placeholder-gray-500"
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-white text-[var(--primary-color)] hover:bg-white/90"
          }`}
        >
          {loading ? "Submitting..." : "Subscribe"}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="colored" />
    </section>
  );
};

export default NewsLetter;
