import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

/* Layout */
import Navbar from "./Component/Navbar/Navbar";
import Footer from "./Component/Footer";
import Whatsapp from "./Component/Whatsapp";
import PopupManager from "./Component/Popup/NotificationPopup";
import ProtectedRoute from "./auth/ProtectedRoute";
import ScrollToTop from "./utils/ScrollToTop";

/* Static Pages */
import PrivatePolicy from "./Pages/Policy/PrivatePolicy";
import Terms from "./Pages/Policy/Terms";
import Refund from "./Pages/Policy/Refund";

/* Lazy Pages */
const Home = lazy(() => import("./Pages/Home"));
const Aboutus = lazy(() => import("./Pages/Aboutus"));
const ContactUs = lazy(() => import("./Pages/ContactUs"));
const Courses = lazy(() => import("./Pages/Courses"));
const DynamicCourses = lazy(() => import("./Pages/DynamicCourse"));
const Quiz = lazy(() => import("./Pages/Quiz"));
const DynamicQuiz = lazy(() => import("./Pages/DynamicTest"));
const StudyMaterial = lazy(() => import("./Pages/StudyMaterial"));
const DynamicExam = lazy(() => import("./Pages/DynamicExam"));
const Profile = lazy(() => import("./Pages/UserProfile"));
const Blog = lazy(() => import("./Pages/Blog"));
const DynamicBlog = lazy(() => import("./Pages/DynamicBlog"));
const Cart = lazy(() => import("./Pages/Cart"));
const Login = lazy(() => import("./auth/Login"));
const Register = lazy(() => import("./auth/Register"));
const ViewQuizPop = lazy(() => import("./Component/ViewQuizPop"));
const Batches = lazy(() => import("./Pages/Batches"));
const ForgotPassword = lazy(() => import("./Form/ForgotPassword"));
const NewPassword = lazy(() => import("./Form/NewPassword"));

/* ------------------------------------------------------------------
    MAIN APP COMPONENT (OPTIMIZED & SAFE)
-------------------------------------------------------------------*/

export default function App() {
  return (
    <Router>
      {/* Scroll restoration */}
      <ScrollToTop />

      <div className="App flex flex-col min-h-screen bg-white text-gray-900">
        {/* Navbar */}
        <Navbar />

        {/* Page Loader */}
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[70vh] text-gray-500 animate-pulse text-lg font-medium">
              Loading page…
            </div>
          }
        >
          <main className="flex-grow mt-28">
            <Routes>
              {/* PUBLIC */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<Aboutus />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/study-material" element={<StudyMaterial />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<DynamicBlog />} />
              <Route path="/batches" element={<Batches />} />

              {/* AUTH */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<NewPassword />} />

              {/* POLICY */}
              <Route path="/privacy" element={<PrivatePolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund" element={<Refund />} />

              {/* DYNAMIC */}
              <Route path="/courses/:courseId" element={<DynamicCourses />} />
              <Route path="/exams/:_id" element={<DynamicExam />} />
              <Route path="/quiz/:_id" element={<DynamicQuiz />} />
              <Route path="/view-quiz/:finalQuizId" element={<ViewQuizPop />} />

              {/* PROTECTED */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-500">
                    <img src="/404.jpg" alt="Not Found" />
                  </div>
                }
              />
            </Routes>
          </main>
        </Suspense>

        {/* Floating Buttons & Footer */}
        <Whatsapp />
        <Footer />
        <PopupManager />

        {/* Toast */}
        <ToastContainer
          position="top-right"
          autoClose={1000}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </div>
    </Router>
  );
}
