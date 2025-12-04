import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function NewPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // ID comes from link: /new-password?id=<id>
  const id = params.get("id");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      toast.error("Invalid or expired reset link");
      setTimeout(() => navigate("/forgot-password"), 2000);
    }
  }, [id]);

  const validatePassword = () => {
    let msg = "";
    if (password.length < 6) msg = "Password must be at least 6 characters";
    else if (!/[A-Z]/.test(password)) msg = "Include at least one uppercase letter";
    else if (!/[a-z]/.test(password)) msg = "Include at least one lowercase letter";
    else if (!/[0-9]/.test(password)) msg = "Include at least one number";
    return msg;
  };

  const handleSubmit = async () => {
    const strengthError = validatePassword();
    if (strengthError) return toast.error(strengthError);

    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    if (!id) return toast.error("Invalid reset link");

    setLoading(true);

    try {
      const res = await fetch(
        `https://backend.palgharhome.com/api/reset-password/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (data?.success) {
        toast.success("Password reset successful!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data?.msg || "Unable to reset password");
      }
    } catch (err) {
      toast.error("Server error, try again later");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <ToastContainer theme="colored" />

      <div
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 animate-[fadeIn_0.3s_ease,scaleIn_0.3s_ease]"
        style={{ animation: "fadeIn 0.3s ease, scaleIn 0.3s ease" }}
      >
        <style>
          {`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes scaleIn { from { transform: scale(0.85) } to { transform: scale(1) } }
          `}
        </style>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          🔐 Set New Password
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Create a strong password to secure your account.
        </p>

        {/* New Password */}
        <div className="mb-4">
          <label className="text-sm font-medium mb-1 block">New Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter new password"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-1 block">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Confirm password"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full p-3 text-white font-semibold rounded-lg transition 
          ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
