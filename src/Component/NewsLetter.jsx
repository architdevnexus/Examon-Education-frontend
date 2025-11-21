import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Cookies from "js-cookie";

//  Create reusable axios instance for better scalability
const api = axios.create({
  baseURL: "http://194.238.18.1:3004/api",
  withCredentials: true, // ensure cookies are sent if backend uses sessions
  timeout: 10000, // 10s timeout for safety
});

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  //  Handle newsletter subscription
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setLoading(true);

    try {
      //  Retrieve token securely from cookies
      const token = Cookies.get("accessToken");
      console.log(token)
      if (!token) {
        toast.error("Please log in before subscribing!");
        return;
      }

      //  Post to API with token in Authorization header
      const response = await api.post(
        "/subscribe",
        { email: email.trim() },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      //  Handle success
      if (response?.data?.success) {
        toast.success("🎉 You’ve successfully subscribed to our newsletter!");
        setEmail("");
      } else {
        toast.warn("Subscription request received, please check your inbox.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      const msg =
        error.response?.data?.message ||
        (error.code === "ECONNABORTED"
          ? "Request timed out. Please try again."
          : "Something went wrong. Try again later!");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[var(--primary-color)] text-white rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 hover:shadow-indigo-300/30">
      {/* Left: Icon */}
      <div className="flex-shrink-0">
        <img
          src="/books.svg"
          alt="Newsletter illustration"
          className="w-24 h-24 md:w-28 md:h-28"
          loading="lazy"
        />
      </div>

      {/* Middle: Text */}
      <div className="flex flex-col md:flex-1 gap-2 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold leading-snug">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-white/80 text-base md:text-lg max-w-lg">
          Stay ahead with the latest news, batches, and study updates. Enter
          your email to join our learning community!
        </p>
      </div>

      {/* Right: Subscription Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto md:w-1/2 mt-3"
      >
        <label htmlFor="email" className="sr-only">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 p-3 rounded-lg outline-none border border-transparent focus:border-white focus:ring-2 focus:ring-white transition bg-white/90 text-gray-900 placeholder-gray-500"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-white text-[var(--primary-color)] hover:bg-white/90"
          }`}
        >
          {loading ? "Submitting..." : "Subscribe"}
        </button>
      </form>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        theme="colored"
      />
    </section>
  );
};

export default NewsLetter;
