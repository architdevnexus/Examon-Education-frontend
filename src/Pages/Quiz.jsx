import React, {
  useState,
  useEffect,
  useMemo,
  Suspense,
  lazy,
} from "react";
import { motion } from "framer-motion";
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

  useEffect(() => {
    if (!quizData.length) fetchQuiz();
  }, [fetchQuiz, quizData.length]);

  const examOptions = useMemo(() => {
    const exams = quizData.map((q) => q.exam).filter(Boolean);
    return ["All", ...new Set(exams)];
  }, [quizData]);

  const filteredQuizzes = useMemo(() => {
    return quizData.filter((quiz) => {
      const matchesSearch =
        quiz.title?.toLowerCase().includes(search.toLowerCase()) ||
        quiz.tags?.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        );
      const matchesExam =
        selectedExam === "All" || quiz.exam === selectedExam;
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
        {/* Header */}
        <header className="relative flex flex-col gap-3 text-white rounded-2xl bg-[var(--primary-color)] p-5 shadow-lg">
          <div className="absolute right-0 top-0 opacity-10">
            <img src="/questionmark.svg" alt="" className="w-64 h-64" />
          </div>

          <div className="flex justify-between items-center flex-wrap gap-3 relative z-10">
            <div className="flex items-center gap-3 text-2xl font-semibold">
              <span>All Quizzes</span>
              <img src="/questionmark.svg" alt="" className="w-8 h-8" />
            </div>

            {/* Filter Button + Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilter((p) => !p)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg backdrop-blur-sm"
              >
                <FiFilter />
                <span className="hidden sm:inline">Filters</span>
              </button>

              {showFilter && (
                <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl p-4 z-50">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Filter Quizzes
                    </h3>
                    <button onClick={() => setShowFilter(false)}>
                      <IoClose className="text-lg" />
                    </button>
                  </div>

                  {/* Exam Filter */}
                  <div className="flex flex-col gap-2">
                    {examOptions.map((exam) => (
                      <label
                        key={exam}
                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="exam"
                          value={exam}
                          checked={selectedExam === exam}
                          onChange={(e) =>
                            setSelectedExam(e.target.value)
                          }
                        />
                        <span>{exam}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm md:text-base leading-relaxed relative z-10">
            Browse through all quizzes. Filter by exam, search topics, and
            start your test prep.
          </p>

          <input
            type="text"
            placeholder="Search by title, exam, or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2 w-full md:max-w-md rounded-xl p-3 text-white border border-gray-300 bg-transparent placeholder:text-gray-200"
          />
        </header>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8 px-2 md:px-4">
          <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {loading ? (
              <div className="col-span-full text-center py-10 text-gray-500">
                Loading quizzes...
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-10 text-red-500">
                {error}
              </div>
            ) : paginatedData.length ? (
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
              <div className="col-span-full text-center py-10 text-gray-500">
                No quizzes found.
              </div>
            )}
          </section>

          <aside className="w-full lg:w-80">
            <Suspense fallback={<div>Loading...</div>}>
              <div className="hidden lg:block sticky top-24">
                <CoursesYouLike title />
              </div>
              <div className="lg:hidden mt-8">
                <CoursesYouLike title={false} />
              </div>
            </Suspense>
          </aside>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-6  mt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="cursor-pointer"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
               className="cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Quiz;
