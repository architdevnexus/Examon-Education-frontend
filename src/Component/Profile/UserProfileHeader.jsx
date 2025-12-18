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
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({
    fullname: name || "",
    email: email || "",
    phone: "",
    batch: "",
    imageFile: null,
  });

  const [preview, setPreview] = useState(null);

  /* ---------------- Fetch Profile ---------------- */
  useEffect(() => {
    if (userId && token) fetchUserProfile(userId, token);
  }, [userId, token, fetchUserProfile]);

  /* ---------------- Sync Profile ---------------- */
  useEffect(() => {
    if (userData?.[0]) {
      const user = userData[0];
      setForm({
        fullname: name || "",
        email: email || "",
        phone: user.phone || "",
        batch: user.preferedCourse || "",
        imageFile: null,
      });
      setPreview(user.profileImage || null);
    }
  }, [userData, name, email]);

  const handleChange = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  /* ---------------- File Upload ---------------- */
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, imageFile: file }));
    setPreview(URL.createObjectURL(file));
  }, []);

  /* ---------------- Save Profile ---------------- */
  const handleSave = async () => {
    if (!form.phone.trim()) return toast.warn("Phone number is required");
    if (!form.batch) return toast.warn("Please select a batch");
    if (!token || !userId) return toast.error("Unauthorized");

    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("phone", form.phone);
      formData.append("preferedCourse", form.batch);

      if (form.imageFile) {
        formData.append("profileImage", form.imageFile);
      }

      await axios.patch(
        `${API_BASE}/profile/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      toast.success("Profile updated successfully!");
      await fetchUserProfile(userId, token);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setUploadProgress(0);

    if (userData?.[0]) {
      const user = userData[0];
      setForm({
        fullname: name || "",
        email: email || "",
        phone: user.phone || "",
        batch: user.preferedCourse || "",
        imageFile: null,
      });
      setPreview(user.profileImage || null);
    }
  };

  /* ---------------- Cleanup ---------------- */
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="relative w-full max-w-full mx-auto">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white/90 backdrop-blur-md border shadow-xl rounded-2xl p-6"
        >
          {/* Header */}
          <div className="flex justify-end mb-5">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex gap-2 text-sm text-blue-600"
              >
                <FaEdit /> Edit
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-xl disabled:opacity-60"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>

          {/* Upload Progress Bar */}
          {uploadProgress > 0 && (
            <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {/* Profile Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="flex flex-col items-center">
              <div className="relative w-42 h-42 rounded-full overflow-hidden border bg-gray-50">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
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
                      className="absolute bottom-8 right-2 bg-white p-2 rounded-full shadow"
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
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <Field label="Full Name" value={form.fullname} readOnly />
              <Field label="Email" value={form.email} readOnly />
              <Field
                label="Phone Number"
                value={form.phone}
                disabled={!editMode}
                onChange={(e) => handleChange("phone", e.target.value)}
              />

              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Select Batch
                </label>
                <select
                  value={form.batch}
                  disabled={!editMode}
                  onChange={(e) => handleChange("batch", e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-sm"
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
    <label className="text-sm text-gray-600 mb-1 block">{label}</label>
    <input
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      disabled={disabled}
      className="w-full border rounded-xl px-3 py-2 text-sm bg-gray-50"
    />
  </div>
);

export default React.memo(ProfileEditDropdown);
  