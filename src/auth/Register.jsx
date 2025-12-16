import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthStore } from "../Zustand/useAuthStore";

const Register = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuthStore();

  const [step, setStep] = useState(1);
  const [counter, setCounter] = useState(60);
  const otpRefs = useRef([]);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // -------------------------------
  // AUTO FOCUS ON FULLNAME
  // -------------------------------
  useEffect(() => {
    document.getElementById("fullname")?.focus();
  }, []);

  // -------------------------------
  // OTP COUNTER
  // -------------------------------
  useEffect(() => {
    if (step === 2 && counter > 0) {
      const timer = setTimeout(() => setCounter((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, counter]);

  // -------------------------------
  // FORM INPUT HANDLER
  // -------------------------------
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    [errors]
  );

  // -------------------------------
  // VALIDATION
  // -------------------------------
  const validate = () => {
    const newErrors = {};

    if (!formData.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------
  // SUBMIT REGISTER
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await signup(formData);

    if (result?.success) {
      toast.success("OTP sent to your email!");

      setTimeout(() => {
        setStep(2);
        setCounter(60);
        otpRefs.current[0]?.focus();
      }, 800);
    } else {
      toast.error(result?.msg || "Registration failed or Email Already Exists");
    }

  };

  // -------------------------------
  // OTP HELPERS
  // -------------------------------
  const getOtp = () =>
    otpRefs.current.map((el) => el?.value || "").join("");

  const handleOtpChange = (value, index) => {
    if (!/^\d$/.test(value)) {
      otpRefs.current[index].value = "";
      return;
    }
    if (index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpRefs.current[index].value && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // -------------------------------
  // VERIFY OTP
  // -------------------------------
  const handleVerify = async () => {
    const finalOtp = getOtp();

    if (finalOtp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      const res = await fetch("https://backend.mastersaab.co.in//verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: finalOtp,
        }),
      });

      const data = await res.json();

      if (data?.success) {
        toast.success("OTP Verified!");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(data?.message || "Invalid OTP");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // -------------------------------
  // RESEND OTP
  // -------------------------------
  const handleResend = async () => {
    try {
      const res = await fetch("https://backend.mastersaab.co.in//resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (data?.success) {
        toast.success("OTP Sent Again!");
        setCounter(60);

        otpRefs.current.forEach((inp) => (inp.value = ""));
        otpRefs.current[0]?.focus();
      }
    } catch {
      toast.error("Server error");
    }
  };

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[90%] max-w-3xl overflow-hidden flex flex-col md:flex-row relative">

        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute cursor-pointer top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* Left Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="/login.png"
            alt="Register visual"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="flex flex-col justify-center w-full md:w-1/2 p-8">

          {/* ---------------- STEP 1 (REGISTER) ---------------- */}
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Register to start your learning journey with Examon Education.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Full Name */}
                <div>
                  <label className="text-sm text-gray-500 dark:text-white font-medium">Full Name</label>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full p-2 text-black dark:text-white outline-none rounded-full border ${errors.fullname ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.fullname && (
                    <p className="text-red-500 text-xs">{errors.fullname}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm text-gray-500 dark:text-white font-medium">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full p-2 text-black dark:text-white outline-none rounded-full border ${errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm text-gray-500 dark:text-white font-medium">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={`w-full p-2 text-black dark:text-white outline-none rounded-full border ${errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-3 w-full flex items-center justify-center gap-2 text-white py-2 rounded-full transition ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {loading ? "Registering..." : <>Register <FaArrowRight /></>}
                </button>
              </form>

              {/* Login redirect */}
              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Login
                </button>
              </div>
            </>
          )}

          {/* ---------------- STEP 2 (OTP) ---------------- */}
          {step === 2 && (
            <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-4">

              <h2 className="text-xl font-semibold text-gray-800">Verify OTP</h2>
              <p className="text-sm text-gray-500 text-center">
                Enter the 6-digit code sent to <b>{formData.email}</b>
              </p>

              <div className="flex gap-3">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    maxLength={1}
                    ref={(el) => (otpRefs.current[i] = el)}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    className="w-10 h-12 text-gray-500 text-2xl text-center font-bold border border-gray-300 rounded-xl focus:outline-none"
                  />
                ))}
              </div>

              <button
                onClick={handleVerify}
                className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold text-lg hover:bg-blue-700"
              >
                Confirm OTP
              </button>

              <button
                disabled={counter !== 0}
                onClick={handleResend}
                className={`w-full py-2 rounded-xl font-semibold text-md ${counter === 0
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
              >
                {counter === 0 ? "Resend OTP" : `Resend OTP in ${counter}s`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Register);
