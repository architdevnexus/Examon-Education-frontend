import React, { useEffect, useMemo } from "react";
import { useQuizStore } from "../Zustand/userQuizDetails";
import { motion } from "framer-motion";
import ProfileQuizCard from "../Component/Card/ProfleQuizCard";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function AttemptedQuiz() {
  const { data, loading, error, fetchQuiz } = useQuizStore();

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  // Raw attempts from backend
  const attemptedQuizzes = data?.attempts || [];
  // console.log(attemptedQuizzes)

  // Normalize each quiz: Score, totalMarks, answers, quizId
  const normalizedQuizzes = useMemo(() => {
    return attemptedQuizzes.map((quiz) => {
      const quizId = quiz.quizId || quiz._id;

      const totalMarks =
        quiz.totalMarks ||
        quiz.totalQuestions ||
        quiz.answers?.length ||
        0;

      const calculatedScore = quiz.answers
        ? quiz.answers.filter((a) => a.isCorrect).length
        : quiz.score || 0;

      return {
        ...quiz,
        quizId,
        totalMarks,
        score: calculatedScore,
        answers: quiz.answers || [],
      };
    });
  }, [attemptedQuizzes]);

  // Pie chart stats
  const quizStats = useMemo(() => {
    if (!normalizedQuizzes.length) return { passed: 0, failed: 0 };

    return normalizedQuizzes.reduce(
      (acc, quiz) => {
        const percent = (quiz.score / quiz.totalMarks) * 100;
        percent >= 40 ? acc.passed++ : acc.failed++;
        return acc;
      },
      { passed: 0, failed: 0 }
    );
  }, [normalizedQuizzes]);

  const chartData = [
    { name: "Passed", value: quizStats.passed, color: "#22C55E" },
    { name: "Failed", value: quizStats.failed, color: "#EF4444" },
  ];

  return (
    <div className="mt-10 w-full">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Your Attempted Quizzes
        </h1>

        <span className="text-gray-600 font-medium">
          {normalizedQuizzes.length} Attempted
        </span>
      </motion.div>

      {/* PIE CHART + QUIZ CARDS */}
      <div className="w-full mt-6 flex flex-col gap-6">
        {/* PIE CHART */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white border shadow-sm rounded-xl p-5"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Quiz Performance
          </h3>

          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                >
                  {chartData.map((item, index) => (
                    <Cell key={index} fill={item.color} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#22C55E]" />
              <p className="text-sm">Passed: {quizStats.passed}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
              <p className="text-sm">Failed: {quizStats.failed}</p>
            </div>
          </div>
        </motion.div>

        {/* QUIZ CARDS */}
        <div className="w-full">
          {loading ? (
            <p className="text-gray-500">Loading quizzes...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : normalizedQuizzes.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex overflow-x-auto gap-5 pb-4 scrollbar-hide snap-x snap-mandatory"
            >
              {normalizedQuizzes.map((quiz, i) => (
                <motion.div
                  key={quiz.quizId || i}
                  className="min-w-[260px] flex-shrink-0 snap-start"
                >
                  {/* FULL DATA PASSED TO CARD */}
                  <ProfileQuizCard
                    quiz={{
                      quizId: quiz.quizId,
                      quizTitle: quiz.quizTitle,
                      score: quiz.score,
                      totalMarks: quiz.totalMarks,
                      answers: quiz.answers,
                      attemptedAt: quiz.attemptedAt,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <img
                src="/no-data.svg"
                alt="No quiz"
                className="h-24 w-24 opacity-60 mb-3"
              />
              <p>No quizzes attempted yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
