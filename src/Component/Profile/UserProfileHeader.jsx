import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCamera, FaSave, FaEdit, FaTimes, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useCourseStore } from "../../Zustand/GetAllCourses";
import { useProfileData } from "../../Zustand/GetuseProfile";

const API_BASE = "https://backend.mastersaab.co.in";

const ProfileEditDropdown = () => {
  const { data: coursesData = [] } = useCourseStore();
  const { userData, fetchUserProfile } = useProfileData();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  //  Get persistent data from localStorage (token store)
  const stored = JSON.parse(localStorage.getItem("token"))?.state || {};
  const { token, userId, name, email } = stored;

  //  Local form state
  const [form, setForm] = useState({
    fullname: name || "",
    email: email || "",
    phone: "",
    course: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  //  Fetch user profile (editable data)
  useEffect(() => {
    if (userId && token) {
      fetchUserProfile(userId, token);
    }
  }, [userId, token, fetchUserProfile]);



  //  When profile data changes (after fetch)
  useEffect(() => {
    if (userData) {
      setForm((prev) => ({
        ...prev,
        phone: userData?.[0].phone || "",
        course: userData?.[0].preferedCourse || "",
        image: userData?.[0].profileImage || null,
      }));
      setPreview(userData?.[0].profileImage || null);
    }
  }, [userData]);

  // ========== Handlers ==========
  const handleChange = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        handleChange("image", file);
      }
    },
    [handleChange]
  );

  // Update user profile
  const handleSave = async () => {
    if (!form.phone.trim()) return toast.warn("Phone number is required");
    if (!form.course) return toast.warn("Please select a course");
    if (!token) return toast.error("Unauthorized! Please login again.");
    if (!userId) return toast.error("Invalid user.");

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("phone", form.phone);
      payload.append("preferedCourse", form.course);
      if (form.image instanceof File) payload.append("profileImage", form.image);

      const res = await axios.patch(`${API_BASE}/profile/update/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully!");
      fetchUserProfile(userId, token); // Refresh latest data
      setEditMode(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update profile";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

const handleCancel = () => {
  setEditMode(false);

  if (userData?.[0]) {
    setForm({
      fullname: name || "",
      email: email || "",
      phone: userData[0].phone || "",
      course: userData[0].preferedCourse || "",
      image: userData[0].profileImage || null,
    });

    setPreview(userData[0].profileImage || null);
  }
};


  // ========== Render ==========
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
              <div className="relative w-28 h-28 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
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
                      className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
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

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm text-gray-600 mb-1">Select Course</label>
                  <span className="text-xs text-gray-500">
                    Your: {form.course ? form.course : "No course selected"}
                  </span>
                </div>
                <select
                  value={form.course}
                  onChange={(e) => handleChange("course", e.target.value)}
                  disabled={!editMode}
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none transition ${editMode
                      ? "border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                >
                  <option value="">-- Select Course --</option>
                  {coursesData.map((c, i) => (
                    <option key={i} value={c.courseDetails || c.name || c.title}>
                      {c.courseDetails || c.name || c.title}
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

//  Reusable Input Field
const Field = ({ label, value, onChange, readOnly, disabled }) => (
  <div>
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      disabled={disabled}
      className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none transition ${disabled || readOnly
          ? "border-gray-200 bg-gray-50 text-gray-600"
          : "border-blue-400 focus:ring-2 focus:ring-blue-100"
        }`}
    />
  </div>
);

export default React.memo(ProfileEditDropdown);
