import React, { useState, useCallback, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../Zustand/UserData";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /** Auto-focus email field on mount */
  useEffect(() => {
    document.getElementById("email")?.focus();
  }, []);

  /** Redirect if already authenticated */
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  /** Handle input change */
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [errors]
  );

  /** Validate input fields */
  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /** Handle login form submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://backend.palgharhome.com/api/signin",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      const { user, message, accessToken } = data;
      if (!accessToken || !user) throw new Error("Invalid server response");

      //  Zustand handles persistence (only token is stored)
      login(user, accessToken);

      toast.success("Login successful!", { duration: 800 });
      navigate("/profile", { replace: true });
    } catch (err) {
      console.error("Login Error:", err);
      const msg =
        err.response?.data?.message ||
        (err.code === "ECONNABORTED"
          ? "Request timed out. Please try again."
          : "Invalid email or password.");
      toast.error(msg, { duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90%] max-w-3xl overflow-hidden flex flex-col md:flex-row relative">
          {/* Close Button */}
          <button
            onClick={() => navigate("/")}
            aria-label="Close Login"
            className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
          >
            ✕
          </button>

          {/* Left Image */}
          <div className="hidden md:block md:w-1/2">
            <img
              src="https://images.pexels.com/photos/34063100/pexels-photo-34063100.jpeg"
              alt="Login visual"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Right Form */}
          <div className="flex flex-col justify-center w-full md:w-1/2 p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Welcome to Examon Education
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Enter your login credentials!
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full p-2 rounded-full border ${errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 dark:border-gray-700 focus:ring-blue-400"
                    } focus:outline-none text-black focus:ring-2 dark:bg-gray-800 dark:text-white`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full p-2 rounded-full border ${errors.password
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 dark:border-gray-700 focus:ring-blue-400"
                      } focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-3 text-gray-500 text-sm"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`mt-3 w-full flex items-center justify-center gap-2 text-white py-2 rounded-full transition ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {loading ? "Logging in..." : <>Login <FaArrowRight /></>}
              </button>
            </form>

            {/* Register Redirect */}
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Don’t have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-600 font-semibold hover:underline"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;
