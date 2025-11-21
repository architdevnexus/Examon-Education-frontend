import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import QuizPageComponent from "../Component/Quiz/QuizPageComponent";
import CategoryCourses from "../Component/CategoryCourses";

const API_BASE = "http://194.238.18.1:3004/api";

const DynamicTest = () => {
  const { _id } = useParams();

  const [quizData, setQuizData] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const abortController = useRef(null);

  /** -----------------------------
   * 🚀 Fetch quiz by ID (Optimized)
   * ------------------------------ */
  const fetchQuizById = useCallback(async () => {
    if (!_id) {
      setError("Quiz ID missing from the URL.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Cancel previous request if any
      if (abortController.current) abortController.current.abort();
      abortController.current = new AbortController();

      const { data } = await axios.get(`${API_BASE}/quizzes/${_id}`, {
        signal: abortController.current.signal,
        timeout: 8000,
      });

      setQuizData(data);
    } catch (err) {
      if (err.name === "CanceledError") return;

      console.error("❌ Quiz fetch error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load quiz. Try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [_id]);

  /** Fetch on mount */
  useEffect(() => {
    fetchQuizById();

    return () => {
      if (abortController.current) abortController.current.abort();
    };
  }, [fetchQuizById]);

  /** ------------------------------------------
   * 🚀 Submit quiz answers securely (Optimized)
   * ------------------------------------------- */
  const handleSubmitQuiz = useCallback(
    async (answers) => {
      let auth;
      try {
        auth = JSON.parse(localStorage.getItem("auth"));
      } catch {
        auth = null;
      }

      const token = auth?.token;
      if (!token) {
        toast.warn("Please login before submitting the quiz!");
        return;
      }

      try {
        setSubmitting(true);

        const { data } = await axios.post(
          `${API_BASE}/quizzes/${_id}/submit`,
          { answers },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );

        setQuizResult(data);
        toast.success("Quiz submitted successfully!");
      } catch (err) {
        console.error("❌ Quiz submission error:", err);

        const message =
          err.response?.data?.message ||
          (err.code === "ECONNABORTED"
            ? "Request timed out. Please try again."
            : "Quiz submission failed!");

        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
    [_id]
  );

  /** ------------------------------------------
   *  UI States (Production UI)
   * ------------------------------------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600 animate-pulse">Loading quiz…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6">
        <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
        <button
          onClick={fetchQuizById}
          className="px-5 py-2 bg-[var(--primary-color)] text-white font-medium rounded-lg hover:bg-[var(--secondary-color)] shadow-md transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">No quiz found.</p>
      </div>
    );
  }

  /** ------------------------------------------
   *  Final Layout
   * ------------------------------------------- */
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f9fbff] to-white mb-24 md:mb-1 px-4 md:px-8 pb-6">
      <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* QUIZ MAIN SECTION */}
        <section className="lg:col-span-2 mb-12 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 mt-4">
          <QuizPageComponent
            quizData={quizData}
            onSubmit={handleSubmitQuiz}
            submitting={submitting}
            quizResult={quizResult}
          />
        </section>

        {/* RELATED COURSES */}
        <aside className="w-full flex-shrink-0">
          <CategoryCourses category={quizData?.exam} />
        </aside>
      </div>
    </main>
  );
};

export default DynamicTest;
