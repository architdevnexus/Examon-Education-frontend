import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaLock, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const API_BASE = "https://backend.mastersaab.co.in/api";

const ChangePassword = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);

      const authData = JSON.parse(localStorage.getItem("token"));
      const token = authData?.state?.token;
      if (!token) {
        toast.error("Unauthorized! Please login again.");
        return;
      }

      const response = await axios.patch(
        `${API_BASE}/change-password`,
        { oldPassword, newPassword, confirmNewPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      onClose();
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white w-[90%] sm:w-[400px] rounded-2xl shadow-2xl relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaLock className="text-blue-600" />
                Change Password
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">
              <PasswordField
                label="Current Password"
                value={oldPassword}
                onChange={setOldPassword}
                placeholder="Enter your current password"
              />
              <PasswordField
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="Enter new password"
              />
              <PasswordField
                label="Confirm New Password"
                value={confirmNewPassword}
                onChange={setConfirmNewPassword}
                placeholder="Re-enter new password"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                className={`px-5 py-2 rounded-lg text-white font-medium transition flex items-center gap-2 ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

//  Extracted password input for reusability
const PasswordField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition text-sm"
      placeholder={placeholder}
    />
  </div>
);

export default ChangePassword;
