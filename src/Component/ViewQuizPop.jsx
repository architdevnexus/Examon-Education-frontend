import React, { useEffect, useMemo , lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuizStore } from "../Zustand/userQuizDetails";
import CoursesYouLike from "./CoursesYouLike";

const ViewQuizPage = () => {
  const { finalQuizId: quizId } = useParams();
  const { data, loading, error, fetchQuiz } = useQuizStore();

  // Fetch on mount
  useEffect(() => {
    fetchQuiz();
  }, []);

  // Extract attempts
  const attempts = useMemo(() => {
    return Array.isArray(data?.attempts) ? data.attempts : [];
  }, [data]);

  console.log("URL quizId:", quizId);
  console.log("Attempts:", attempts);

  // Correct comparison using quizId from API
  const quiz = useMemo(() => {
    if (!quizId || attempts.length === 0) return null;

    // MATCH quizId from API
    const selected = attempts.find(
      (item) => String(item.quizId) === String(quizId)
    );

    if (!selected) return null;

    return {
      ...selected,
      attemptedAt: selected.attemptedAt || null,
      questions: Array.isArray(selected.questions) ? selected.questions : [],
      totalQuestions: selected.questions?.length || 0,
      score: selected.score ?? 0,
      quizTitle: selected.quizTitle || "Quiz",
      quizTotalMarks: selected.quizTotalMarks || selected.totalMarks || 0
    };
  }, [attempts, quizId]);

  // Scroll top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Loading
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading quiz details...
      </div>
    );

  // Error
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );

  // Quiz Not Found
  if (!quiz)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-600">
          Quiz not found or not attempted yet.
        </p>
      </div>
    );

  return (
   <div className="w-full mb-14 max-w-7xl mx-auto px-4 py-6">

  {/* Main Grid Layout */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

    {/* MAIN CONTENT (HEADER + QUESTIONS) */}
    <div className="col-span-2 w-full">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-bold text-blue-600 mb-3">
          {quiz.quizTitle} Result
        </h1>

        <p className="text-gray-700">
          <span className="font-semibold">Attempted At:</span>{" "}
          {quiz.attemptedAt
            ? new Date(quiz.attemptedAt).toLocaleString()
            : "N/A"}
        </p>

        <p className="text-gray-700">
          <span className="font-semibold">Total Questions:</span>{" "}
          {quiz.totalQuestions}
        </p>

        <p className="text-gray-700">
          <span className="font-semibold">Score:</span>{" "}
          {quiz.score} / {quiz.quizTotalMarks}
        </p>
      </motion.div>

      {/* QUESTIONS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-6 mb-20"
      >
        {quiz.questions.map((q, index) => {
          const isSkipped = q.userAnswer === null || q.userAnswer === undefined;
          const isCorrect = q.isCorrect;

          return (
            <motion.div
              key={q.questionId || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              whileHover={{ scale: 1.01 }}
              className={`rounded-xl border shadow-sm p-5 transition-all ${
                isCorrect
                  ? "bg-green-50 border-green-300"
                  : isSkipped
                  ? "bg-gray-50 border-gray-300"
                  : "bg-red-50 border-red-300"
              }`}
            >
              {/* Question */}
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                {index + 1}. {q.question}
              </h2>

              {/* Options */}
              <div className="space-y-2 mb-4">
                {q.options.map((option, optIndex) => {
                  const isUser = q.userAnswer === optIndex;
                  const isCorrectAns = q.correctAnswer === optIndex;

                  return (
                    <div
                      key={optIndex}
                      className={`p-2 rounded-lg border text-sm
                        ${isCorrectAns ? "bg-green-200 border-green-500" : ""}
                        ${isUser && !isCorrectAns ? "bg-red-200 border-red-500" : ""}
                      `}
                    >
                      {optIndex + 1}. {option}
                    </div>
                  );
                })}
              </div>

              {/* Status */}
              <div>
                {isCorrect ? (
                  <span className="text-green-700 font-semibold">✔ Correct</span>
                ) : isSkipped ? (
                  <span className="text-yellow-700 font-semibold">⚠ Skipped</span>
                ) : (
                  <span className="text-red-700 font-semibold">✘ Wrong</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>

    {/* SIDEBAR */}
    <aside className="w-full h-full">

      <Suspense
        fallback={
          <div className="text-gray-500 text-center py-10">
            Loading courses...
          </div>
        }
      >
        {/* Desktop Sidebar */}
        <div className="hidden lg:block sticky top-24">
          <CoursesYouLike title />
        </div>

        {/* Mobile / Tablet Sidebar */}
        <div className="block lg:hidden">
          <CoursesYouLike title={false} />
        </div>
      </Suspense>

    </aside>
  </div>
</div>

  );
};

export default ViewQuizPage;
