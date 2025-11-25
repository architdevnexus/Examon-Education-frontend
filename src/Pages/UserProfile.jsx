import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../Zustand/UserData";
import { useCourseStore } from "../Zustand/GetAllCourses";
import { useProfileData } from "../Zustand/GetuseProfile";
import AttemptedQuiz from"../Component/AttemptedQuiz"
import ChangePassword from "../Component/Profile/ChangePassword";

import { ReviewSection } from "../Component/Review/ReivewSection";
import UserProfileHeader from "../Component/Profile/UserProfileHeader";

const API_BASE = "https://backend.palgharhome.com/api";
const api = axios.create({ baseURL: API_BASE, withCredentials: true });

const UserProfile = () => {
  const navigate = useNavigate();


  const { fetchCourses } = useCourseStore();
  const { user, token, updateUser, logout, isAuthenticated } = useAuthStore();
  const { userData, fetchUserProfile } = useProfileData();

  const [form, setForm] = useState({ phone: "" });
  const [selectedCourse, setSelectedCourse] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const fileInputRef = useRef(null);

  // ===============================
  // AUTH CHECK & INITIAL FETCH
  // ===============================
  useEffect(() => {
    if (!isAuthenticated || !token) {
      toast.error("Please log in first.");
      navigate("/login");
      return;
    }

    fetchCourses?.();
    fetchUserProfile();

    if (user) {
      setForm({ phone: user.phone || "" });
      setSelectedCourse(user.preferedCourse || "");
      setImagePreview(user.profileImage || null);
    }
  }, [isAuthenticated, token, user, fetchCourses, fetchUserProfile, navigate]);
  // console.log(userData)
  

  // ===============================
  // LOGOUT HANDLER
  // ===============================
  const handleLogout = useCallback(() => {
    logout();
    toast.success("Logged out successfully!");
    setTimeout(() => navigate("/login"), 600);
  }, [logout, navigate]);

  // ===============================
  // PASSWORD UPDATE HANDLER
  // ===============================
  const handleSavePassword = useCallback(
    async (newPwd) => {
      if (!user?._id) return;
      setPwdLoading(true);
      try {
        await api.patch(`/user/${user._id}/password`, { password: newPwd });
        toast.success("Password changed successfully!");
        setShowPassword(false);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to change password.");
      } finally {
        setPwdLoading(false);
      }
    },
    [user]
  );

  // ===============================
  // QUIZ STATISTICS
  // ===============================


  // ===============================
  // PROFILE UPDATE HANDLER
  // ===============================
  const handleProfileUpdate = useCallback(
    async (updates) => {
      if (!user?._id || !token) {
        toast.error("Unauthorized! Please log in again.");
        navigate("/login");
        return;
      }

      try {
        const { data } = await api.patch(`/user/${user._id}`, updates, {
          headers: { Authorization: `Bearer ${token}` },
        });

        updateUser(data?.user);
        toast.success("Profile updated successfully!");
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to update profile.");
      }
    },
    [user, token, navigate, updateUser]
  );

 

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="min-h-screen mb-18 py-8 px-4 md:px-10 relative">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-8 border-b pb-3">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
          My Profile
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-400 rounded-xl font-medium shadow-sm hover:bg-red-50 hover:shadow-md transition-all"
          >
            <span>Logout</span>
            <FaSignOutAlt />
          </button>

          <button
            onClick={() => setShowPassword(true)}
            className="p-3 rounded-full hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 transition-all"
            title="Change Password"
          >
            <BsThreeDotsVertical className="text-gray-600 text-lg" />
          </button>
        </div>
      </header>

      {/* PROFILE HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <UserProfileHeader
          user={userData || user}
          form={form}
          setForm={setForm}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          imagePreview={imagePreview}
          fileInputRef={fileInputRef}
          onSave={handleProfileUpdate}
        />
      </motion.div>

      <AttemptedQuiz/>
    

        <div className="border-t border-gray-200 mt-10 pt-6">
          <ReviewSection />
        </div>
 

      {/* PASSWORD MODAL */}
      {showPassword && (
        <ChangePassword
          isOpen={showPassword}
          onClose={() => setShowPassword(false)}
          onSubmit={handleSavePassword}
          loading={pwdLoading}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default React.memo(UserProfile);
