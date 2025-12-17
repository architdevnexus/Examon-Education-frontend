import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaSave, FaEdit, FaTimes, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useBatchesStore } from "../../Zustand/GetLiveBatches";
import { useProfileData } from "../../Zustand/GetuseProfile";

const API_BASE = "https://backend.mastersaab.co.in/api";

const ProfileEditDropdown = () => {
  const { batchData = [] } = useBatchesStore();
  const { userData, fetchUserProfile } = useProfileData();

  const fileRef = useRef(null);
  const stored = JSON.parse(localStorage.getItem("token"))?.state || {};
  const { token, userId, name, email } = stored;

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullname: name || "",
    email: email || "",
    phone: "",
    batch: "",
    imageFile: null, // local file
    imageURL: null, // base64 or backend URL
  });
  const [preview, setPreview] = useState(null);

  // Fetch user profile on mount
  useEffect(() => {
    if (userId && token) fetchUserProfile(userId, token);
  }, [userId, token, fetchUserProfile]);

  // Update form when profile data changes
  useEffect(() => {
    if (userData?.[0]) {
      const user = userData[0];
      setForm({
        fullname: name || "",
        email: email || "",
        phone: user.phone || "",
        batch: user.preferedCourse || "",
        imageFile: null,
        imageURL: user.profileImage || null,
      });
      setPreview(user.profileImage || null);
    }
  }, [userData, name, email]);

  const handleChange = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Convert file to Base64 for backend
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Handle file selection
  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      try {
        const base64Url = await fileToBase64(file);
        handleChange("imageFile", file);
        handleChange("imageURL", base64Url);
      } catch (err) {
        toast.error("Failed to process image");
      }
    },
    [handleChange]
  );

  // Save profile
  const handleSave = async () => {
    if (!form.phone.trim()) return toast.warn("Phone number is required");
    if (!form.batch) return toast.warn("Please select a batch");
    if (!token || !userId) return toast.error("Unauthorized! Please login again.");

    setLoading(true);

    try {
      const payload = {
        phone: form.phone,
        preferedCourse: form.batch,
        profileImage: form.imageURL || null,
      };

      console.log("Sending payload to backend:", payload);

      const response = await axios.patch(`${API_BASE}/profile/update/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Backend response:", response.data);

      toast.success("Profile updated successfully!");
      await fetchUserProfile(userId, token);
      setEditMode(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    if (userData?.[0]) {
      const user = userData[0];
      setForm({
        fullname: name || "",
        email: email || "",
        phone: user.phone || "",
        batch: user.preferedCourse || "",
        imageFile: null,
        imageURL: user.profileImage || null,
      });
      setPreview(user.profileImage || null);
    }
  };

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (form.imageFile && preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [form.imageFile, preview]);

  return (
    <div className="relative w-full max-w-full mx-auto">
      <AnimatePresence>
        <motion.div
          key="dropdown"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-6"
        >
          {/* Header */}
          <div className="flex justify-end items-center mb-5">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-end gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <FaEdit /> Edit
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Fields */}
          <div className="min-w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center">
              <div className="relative w-42 h-42 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                {preview ? (
                  <img src={preview} alt="profile" className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <FaCamera size={28} />
                  </div>
                )}
                {editMode && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileRef.current.click()}
                      className="absolute bottom-8 cursor-pointer right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                    >
                      <FaCamera size={14} />
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>
              {editMode && <p className="text-xs text-gray-500 mt-2">Upload new photo</p>}
            </div>

            {/* Text Fields */}
            <div className="space-y-4">
              <Field label="Full Name" value={form.fullname} readOnly />
              <Field label="Email" value={form.email} readOnly />
              <Field
                label="Phone Number"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                disabled={!editMode}
              />

              {/* Batch Selection */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm text-gray-600 mb-1">Select Batch</label>
                  <span className="text-xs text-gray-500">
                    Your: {form.batch || "No batch selected"}
                  </span>
                </div>
                <select
                  value={form.batch}
                  onChange={(e) => handleChange("batch", e.target.value)}
                  disabled={!editMode}
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none transition ${
                    editMode
                      ? "border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  <option value="">-- Select Batch --</option>
                  {batchData.map((b) => (
                    <option key={b._id} value={b.batchName}>
                      {b.batchName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const Field = ({ label, value, onChange, readOnly, disabled }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      disabled={disabled}
      className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none transition ${
        disabled || readOnly
          ? "border-gray-200 bg-gray-50 text-gray-600"
          : "border-blue-400 focus:ring-2 focus:ring-blue-100"
      }`}
    />
  </div>
);

export default React.memo(ProfileEditDropdown);
