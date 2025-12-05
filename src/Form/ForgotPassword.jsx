import React, { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [typingValue, setTypingValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-focus
  useEffect(() => {
    document.getElementById("forgotEmail")?.focus();
  }, []);

  // ----------------------------
  // Debounce input (300ms)
  // ----------------------------
  const debounceEmail = useCallback(() => {
    const timer = setTimeout(() => setEmail(typingValue), 300);
    return () => clearTimeout(timer);
  }, [typingValue]);

  useEffect(() => {
    const cleanup = debounceEmail();
    return cleanup;
  }, [typingValue, debounceEmail]);

  // ----------------------------
  // Submit Handler
  // ----------------------------
  const handleSendEmail = async () => {
    if (!email.trim()) return toast.error("Please enter your email");

    if (!/\S+@\S+\.\S+/.test(email))
      return toast.error("Enter a valid email");

    setLoading(true);
    try {
      const response = await fetch(
        "https://backend.palgharhome.com/api/forgot-password",
        {
          method: "POST",
          credentials: "include", // <-- fetch equivalent of withCredentials
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(data?.message || "Unable to send reset link");
      } else if (data?.success) {
        toast.success("Password reset link sent to your email!");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Network error, please try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <ToastContainer position="top-right" theme="colored" />

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90%] max-w-md p-8 relative">

        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 text-xl hover:text-black cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Forgot Password
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Enter your registered email. We will send you a password reset link.
        </p>

        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Email Address
        </label>

        <input
          id="forgotEmail"
          type="email"
          placeholder="Enter your email"
          value={typingValue}
          onChange={(e) => setTypingValue(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 text-black dark:text-white bg-white dark:bg-gray-800 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Button with Loading Skeleton */}
        <button
          onClick={handleSendEmail}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${loading
              ? "bg-gray-400 cursor-not-allowed animate-pulse"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
}
