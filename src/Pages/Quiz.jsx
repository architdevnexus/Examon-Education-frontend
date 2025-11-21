import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
  lazy,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useAllQuiz } from "../Zustand/GetAllQuiz";
import ExamCard from "../Component/Card/ExamCard";

const CoursesYouLike = lazy(() => import("../Component/CoursesYouLike"));

const Quiz = () => {
  const { quizData = [], loading, error, fetchQuiz } = useAllQuiz();

  const [search, setSearch] = useState("");
  const [selectedExam, setSelectedExam] = useState("All");
  const [page, setPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);

  const itemsPerPage = 6;

  // Fetch all quizzes once
  useEffect(() => {
    if (!quizData.length) fetchQuiz();
  }, [fetchQuiz, quizData.length]);

  // Extract unique exam names
  const examOptions = useMemo(() => {
    const exams = quizData.map((q) => q.exam).filter(Boolean);
    return ["All", ...new Set(exams)];
  }, [quizData]);

  // Filter logic
  const filteredQuizzes = useMemo(() => {
    return quizData.filter((quiz) => {
      const matchesSearch =
        quiz.title?.toLowerCase().includes(search.toLowerCase()) ||
        quiz.tags?.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        );
      const matchesExam = selectedExam === "All" || quiz.exam === selectedExam;
      return matchesSearch && matchesExam;
    });
  }, [quizData, search, selectedExam]);

  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const paginatedData = filteredQuizzes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => setPage(1), [search, selectedExam]);

  return (
    <div className="relative flex flex-col gap-6 p-4 md:py-6 mb-14">
      <main className="flex-1 flex flex-col gap-6">
        {/* --- Header Section --- */}
        <header className="flex flex-col gap-3 text-white rounded-2xl bg-[var(--primary-color)] p-5 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10">
            <img src="/questionmark.svg" alt="pattern" className="w-64 h-64" />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
            <div className="flex items-center gap-3 text-2xl font-semibold">
              <span>All Quizzes</span>
              <img
                src="/questionmark.svg"
                alt="quiz"
                className="w-8 h-8 md:w-9 md:h-9"
              />
            </div>

            <button
              onClick={() => setShowFilter(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg backdrop-blur-sm transition"
            >
              <FiFilter className="text-lg" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          <p className="text-sm md:text-base leading-relaxed relative z-10">
            Browse through all quizzes. Filter by exam, search topics, and
            start your test prep.
          </p>

          {/* Search Bar */}
          <div className="mt-2 w-full md:max-w-md relative z-10">
            <input
              type="text"
              placeholder="Search by title, exam, or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl p-3 text-white border border-gray-300 focus:ring-2 focus:ring-white outline-none bg-transparent placeholder:text-gray-200"
            />
          </div>
        </header>
<div className="flex flex-col lg:flex-row items-start gap-8 px-2 md:px-4">
  {/* --- Content --- */}
  <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
    {loading ? (
      <div className="col-span-full text-center py-10 text-gray-500">
        Loading quizzes...
      </div>
    ) : error ? (
      <div className="col-span-full text-center py-10 text-red-500">
        {error}
      </div>
    ) : paginatedData.length > 0 ? (
      paginatedData.map((quiz) => (
        <motion.div
          key={quiz._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ExamCard examData={quiz} />
        </motion.div>
      ))
    ) : (
      <div className="text-gray-500 col-span-full text-center py-10">
        No quizzes found.
      </div>
    )}
  </section>

  {/* --- Sidebar --- */}
  <aside className="w-full lg:w-80 flex-shrink-0">
    <Suspense fallback={<div className="text-gray-500">Loading courses...</div>}>
      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block sticky top-24">
        <CoursesYouLike title />
      </div>

      {/* Mobile / Tablet Sidebar (below grid) */}
      <div className="block lg:hidden mt-8">
        <CoursesYouLike title={false} />
      </div>
    </Suspense>
  </aside>
</div>


        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-xl ${
                page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border hover:bg-gray-50"
              }`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-xl ${
                  page === i + 1
                    ? "bg-[var(--primary-color)] text-white"
                    : "bg-white text-gray-700 border hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-xl ${
                page === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        )}

        
      </main>

      {/* --- Floating Filter Sidebar --- */}
      <AnimatePresence>
        {showFilter && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilter(false)}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="fixed right-0 w-80 h-3/4 bg-white z-[999] shadow-xl p-6 overflow-y-auto rounded-l-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Filter Quizzes
                </h2>
                <button
                  onClick={() => setShowFilter(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <IoClose className="text-2xl text-gray-600" />
                </button>
              </div>

              {/* Exam Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Exam Category
                </h3>
                <div className="flex flex-col gap-2">
                  {examOptions.map((exam) => (
                    <label
                      key={exam}
                      className="flex items-center gap-2 text-gray-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="exam"
                        value={exam}
                        checked={selectedExam === exam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                      />
                      <span>{exam}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowFilter(false)}
                className="mt-4 w-full py-2 rounded-lg bg-[var(--primary-color)] text-white font-semibold hover:opacity-90 transition"
              >
                Apply Filters
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
