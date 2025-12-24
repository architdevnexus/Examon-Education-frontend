import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const API_BASE = "https://backend.mastersaab.co.in/api";

const DynamicTest = ({ quizData }) => {
  const [answers, setAnswers] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);

  /** Initialize quiz answers and timer **/
  useEffect(() => {
    if (quizData?.questions?.length) {
      setAnswers(
        quizData.questions.map((q, idx) => ({
          questionId: q.id || `q${idx + 1}`,
          selectedIndex: null,
          correctAnswerIndex: q.correctAnswerIndex ?? null,
        }))
      );

      const totalSeconds = quizData.duration || 5 * 60;
      setTimeLeft(totalSeconds);
    }
  }, [quizData]);
  // console.log(quizData)

  /** Countdown Timer **/
  useEffect(() => {
    if (hasSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(timer);
        return 0;
      });
    }, 1000);

    if (!timerStarted && quizData?.questions?.length) {
      setTimerStarted(true);
    }

    return () => clearInterval(timer);
  }, [timeLeft, hasSubmitted, quizData, timerStarted]);

  /** Auto-submit when time runs out **/
  useEffect(() => {
    if (timeLeft === 0 && !hasSubmitted && timerStarted) {
      toast.warn("Time's up! Submitting your quiz...");
      handleSubmitSafe();
    }
  }, [timeLeft, hasSubmitted, timerStarted]);


  const handleOptionSelect = useCallback((questionIndex, optionIndex) => {
    setAnswers((prev) =>
      prev.map((ans, idx) =>
        idx === questionIndex ? { ...ans, selectedIndex: optionIndex } : ans
      )
    );
  }, []);

  const handleNext = useCallback(() => {
    currentQuestionIndex < quizData.questions.length - 1
      ? setCurrentQuestionIndex((i) => i + 1)
      : handleSubmitSafe()
  }, [currentQuestionIndex, quizData]);

  const handleSkip = useCallback(() => {
    currentQuestionIndex < quizData.questions.length - 1
      ? setCurrentQuestionIndex((i) => i + 1)
      : handleSubmitSafe();
  }, [currentQuestionIndex, quizData]);


  const handleSubmit = useCallback(async () => {
    const storedAuth = JSON.parse(localStorage.getItem("token"))?.state?.token || {};
    if (!storedAuth) return toast.warn("Please login before submitting!");

    const token = storedAuth
    if (!token) return toast.error("Invalid session. Please login again.");

    try {
      setSubmitting(true);
      await axios.post(
        `${API_BASE}/quizzes/${quizData._id}/submit`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );
      console.log(answers)

      toast.success("Quiz submitted successfully!");
      setHasSubmitted(true);
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error(err.response?.data?.message || "Submission failed!");
    } finally {
      setSubmitting(false);
    }
  }, [answers, quizData]);

  const handleSubmitSafe = useCallback(() => {
    setTimeout(() => {
      handleSubmit();
    }, 200);
  }, [handleSubmit]);



  const currentQuestion = quizData?.questions?.[currentQuestionIndex];
  if (!quizData?.questions?.length) return <p>Loading quiz...</p>;

  /** Marks & Percentage Calculation **/
  const { score, total, percentage } = useMemo(() => {
    if (!hasSubmitted) return { score: 0, total: 0, percentage: 0 };
    const totalQ = answers.length;
    const correct = answers.filter(
      (a, i) =>
        a.selectedIndex !== null &&
        a.selectedIndex === quizData.questions[i].correctAnswerIndex
    ).length;
    const percent = ((correct / totalQ) * 100).toFixed(2);
    return { score: correct, total: totalQ, percentage: percent };
  }, [hasSubmitted, answers, quizData]);

  const isFail = percentage < 40;

  /** Progress bar calculation **/
  const progressPercent = useMemo(() => {
    if (!quizData?.questions?.length) return 0;
    return ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  }, [currentQuestionIndex, quizData]);

  /** Format timer (mm:ss) **/
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-left border-b pb-4 mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          {quizData?.title || "Quiz"}
        </h2>
        <p className="text-gray-500 mt-1">{quizData?.description}</p>
      </div>

      {/* Timer + Progress */}
      {!hasSubmitted && (
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-medium text-gray-600">
            Question {currentQuestionIndex + 1} / {quizData.questions.length}
          </p>
          <p
            className={`font-semibold flex items-center gap-3 ${timeLeft < 30 ? "text-red-500" : "text-gray-700"
              }`}
          >
            <img src="/timer.svg" alt="" className="h-6 w-6" />{" "}
            {formatTime(timeLeft)}
          </p>
        </div>
      )}

      {/* Progress Bar */}
      {!hasSubmitted && (
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="h-3 bg-[var(--primary-color)] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Quiz Section */}
      {!hasSubmitted && currentQuestion && (
        <div className="space-y-6">
          <div className="rounded-2xl shadow-sm p-5 bg-white transition-all">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">
              {currentQuestionIndex + 1}.{" "}
              {currentQuestion.text || currentQuestion.question}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, optionIndex) => {
                const isSelected =
                  answers[currentQuestionIndex]?.selectedIndex === optionIndex;
                return (
                  <label
                    key={optionIndex}
                    onClick={() =>
                      handleOptionSelect(currentQuestionIndex, optionIndex)
                    }
                    className={`cursor-pointer flex items-center gap-3 border p-3 rounded-xl transition-all ${isSelected
                      ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)]"
                      : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                      }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      checked={isSelected}
                      readOnly
                      className="hidden"
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleSkip}
                disabled={submitting}
                className="px-5 cursor-pointer py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-all disabled:opacity-60"
              >
                Skip
              </button>
              <button
                onClick={
                  currentQuestionIndex === quizData.questions.length - 1
                    ? handleSubmitSafe
                    : handleNext
                }
                disabled={submitting}
                className="px-6 cursor-pointer py-2 bg-[var(--primary-color)] text-white rounded-xl hover:bg-[var(--secondary-color)] transition-all disabled:opacity-60"
              >
                {
                  currentQuestionIndex === quizData.questions.length - 1
                    ? (submitting ? "Submitting..." : "Submit")
                    : "Next"
                }
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Result Section */}
      {hasSubmitted && (
        <div className=" space-y-8 ">
          <div className="relative flex flex-col items-center justify-start">
            <div className="absolute z-999 -left-10 opacity-20">
              <img
                src={isFail ? "/red_Ellipse.svg" : "/green_Ellipse.svg"}
                alt="Result Ellipse"
                className="w-64 h-64"
              />
            </div>

            <div
              className={`relative text-center rounded-md p-8 shadow-sm w-full ${isFail
                ? "bg-[#FFE6E6] text-red-700"
                : "bg-[#E8FFF1] text-green-700"
                }`}
            >
              <div className="flex justify-center mb-4">
                <img
                  src={isFail ? "/sad.svg" : "/happy.svg"}
                  alt="Result Icon"
                  className="w-16 h-16"
                />
              </div>

              <p
                className={`text-sm font-semibold ${isFail ? "text-red-600" : "text-green-600"
                  }`}
              >
                Your Score: {percentage}%
              </p>

              <h3
                className={`text-2xl sm:text-3xl font-bold mt-2 ${isFail ? "text-[#FF1111]" : "text-green-600"
                  }`}
              >
                {isFail ? "Better Luck Next Time!" : "Congratulations, You Passed!"}
              </h3>

              <p className="mt-3 text-[#747474] text-sm sm:text-base">
                {isFail
                  ? "Strengthen your preparation with our expert-led courses to enhance your performance and achieve success."
                  : "Continue your learning journey by exploring our advanced courses for further improvement."}
              </p>
            </div>
          </div>

          {/* Detailed Review */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-800">
              Review Your Answers
            </h4>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 bg-green-100 border-green-400 border inline-block rounded-sm" />
              <span className="text-sm text-gray-700">Correct Answer</span>
              <span className="w-5 h-5 bg-red-100 border-red-400 border inline-block rounded-sm ml-4" />
              <span className="text-sm text-gray-700">Your Answer</span>
              <span className="w-5 h-5 bg-yellow-100 border-yellow-400 border inline-block rounded-sm ml-4" />
              <span className="text-sm text-gray-700">Skipped Question</span>
            </div>

            {quizData.questions.map((q, index) => {
              const userAnswerIndex = answers[index]?.selectedIndex;
              const correctAnswerIndex = q.correctAnswerIndex;
              const skipped = userAnswerIndex === null;

              return (
                <div
                  key={q.id || index}
                  className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all"
                >
                  <p className="font-medium text-gray-800 mb-4">
                    {index + 1}. {q.text || q.question}{" "}
                    {skipped && (
                      <span className="ml-2 text-yellow-600 text-sm font-medium">
                        (Skipped)
                      </span>
                    )}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((option, optionIndex) => {
                      let optionClass = "bg-gray-50 border-gray-200";
                      if (skipped && optionIndex === correctAnswerIndex)
                        optionClass =
                          "bg-yellow-100 border-yellow-400 text-yellow-800";
                      else if (optionIndex === correctAnswerIndex)
                        optionClass =
                          "bg-green-100 border-green-400 text-green-800";
                      else if (optionIndex === userAnswerIndex)
                        optionClass = "bg-red-100 border-red-400 text-red-800";

                      return (
                        <div
                          key={optionIndex}
                          className={`border p-3 rounded-xl ${optionClass}`}
                        >
                          <span>{option}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTest;
