import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { FaMedal, FaTrophy, FaCalendarAlt } from "react-icons/fa";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ProfileQuizCard = ({ quiz }) => {
  const navigate = useNavigate();

  if (!quiz || typeof quiz !== "object") return null;

  /**
   * Normalized quiz data
   */
  const normalizedData = useMemo(() => {
    const quizId = quiz?.quizId || quiz?._id || null;
    const quizTitle = quiz?.quizTitle || quiz?.title || "Untitled Exam";

    const totalMarks =
      quiz?.totalMarks ??
      quiz?.totalQuestions ??
      0;

    const totalQuestions =
      quiz?.totalQuestions ??
      quiz?.totalMarks ??
      0;

    const score = quiz?.score ?? 0;

    const attemptedAt = quiz?.attemptedAt || new Date().toISOString();

    return {
      quizId,
      quizTitle,
      totalMarks,
      totalQuestions,
      score,
      attemptedAt,
    };
  }, [quiz]);

  const { quizId, quizTitle, totalMarks, totalQuestions, score, attemptedAt } =
    normalizedData;

  const finalQuizId = quizId;

  const handleViewDetails = () => {
    if (!finalQuizId) {
      console.warn("Missing quizId for navigation:", quiz);
      return;
    }
    navigate(`/view-quiz/${finalQuizId}`);
  };

  /** -------------------------------
   *  🔥 Same Logic Style as Your Example
   *  useMemo → calculate percentage & result
   * -------------------------------- */
  const { percentage, result, icon, altText, year } = useMemo(() => {
    const percent = totalMarks
      ? ((score / totalMarks) * 100).toFixed(2)
      : 0;

    const result = percent >= 40 ? "Passed" : "Failed";
    const icon = result === "Passed" ? "/passed.svg" : "/fail.svg";
    const altText = result === "Passed" ? "Passed Badge" : "Failed Badge";
    const year = new Date(attemptedAt).getFullYear();

    return { percentage: percent, result, icon, altText, year };
  }, [score, totalMarks, attemptedAt]);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
      className="relative flex flex-col justify-between 
                 bg-gradient-to-b from-[#EAF5FF] to-[#FFFFFF]
                 border border-gray-200 shadow-sm hover:shadow-lg
                 rounded-2xl overflow-hidden 
                 w-[240px] sm:w-[280px] 
                 transition-all duration-300"
    >
      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-base font-semibold text-gray-800 leading-tight truncate">
          {quizTitle}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm gap-2">
            <FaCalendarAlt size={13} />
            <span>{year}</span>
          </div>

          <img
            src={icon}
            alt={altText}
            className="w-14 h-14 object-contain pointer-events-none select-none"
            loading="lazy"
          />
        </div>

        <div className="h-px bg-gray-200" />

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Score:</span> {score}/{totalMarks}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <FaMedal className="text-blue-500" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Result:</span> {result}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex bg-[var(--primary-color)] p-2 items-center justify-center mx-0 w-full">
        <button
          onClick={handleViewDetails}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm 
                     font-medium tracking-wide py-2 rounded-xl cursor-pointer 
                     hover:from-blue-700 hover:to-blue-600 
                     transition w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

ProfileQuizCard.propTypes = {
  quiz: PropTypes.shape({
    quizId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    quizTitle: PropTypes.string,
    totalMarks: PropTypes.number,
    totalQuestions: PropTypes.number,
    score: PropTypes.number,
    attemptedAt: PropTypes.string,
  }),
};

export default memo(ProfileQuizCard);
