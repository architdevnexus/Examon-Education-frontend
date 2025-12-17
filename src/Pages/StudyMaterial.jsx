import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { usePyqStore } from "../Zustand/GetPyq";
import { useNotesStore } from "../Zustand/GetNotes";

// --- Lazy Loaded Components ---
const StudyMaterialPageCard = lazy(() => import("../Component/Card/StudyMaterialPageCard"));
const PyqCard = lazy(() => import("../Component/Card/PyqCard"));
const CoursesYouLike = lazy(() => import("../Component/CoursesYouLike"));

const StudyMaterial = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("notes"); // "notes" | "pyq"
  const [showFilter, setShowFilter] = useState(false);

  const { notesData, loading, error, fetchNotes } = useNotesStore();
  const { pyqData, loading: pyqLoading, error: pyqError, fetchPyq } = usePyqStore();

  // --- Fetch Data on Mount ---
  useEffect(() => {
    fetchNotes();
    fetchPyq();
  }, [fetchNotes, fetchPyq]);

  const itemsPerPage = 6;

  // --- Memoized Data Transformations ---
  const allNotes = useMemo(() => {
    if (!Array.isArray(notesData)) return [];
    return notesData.flatMap((category) =>
      (category.notes || []).map((note) => ({
        ...note,
        category: category.notesCategory,
      }))
    );
  }, [notesData]);

  const categories = useMemo(() => {
    const list = notesData.map((n) => n.notesCategory);
    return ["All", ...new Set(list)];
  }, [notesData]);

  const allPyq = useMemo(() => {
    if (!Array.isArray(pyqData)) return [];
    return pyqData.flatMap((group) =>
      (group.questionspaper || []).map((q) => ({
        ...q,
        category: group.pyqCategory,
      }))
    );
  }, [pyqData]);

  // --- Filtering ---
  const filteredNotes = useMemo(() => {
    return allNotes.filter((item) => {
      const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      const matchesLevel =
        levelFilter === "All" ||
        item.level?.toLowerCase() === levelFilter.toLowerCase();
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [allNotes, search, categoryFilter, levelFilter]);

  const filteredPyq = useMemo(() => {
    return allPyq.filter((item) =>
      item.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [allPyq, search]);

  const currentData = viewMode === "notes" ? filteredNotes : filteredPyq;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const paginatedData = currentData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Reset page when filters or viewMode change
  useEffect(() => setPage(1), [search, categoryFilter, levelFilter, viewMode]);
console.log(filteredNotes)
  return (
    <div className="relative flex flex-col gap-6 p-4 md:py-6 mb-14">
      <main className="flex-1 flex flex-col gap-6">
        {/* --- Header Section --- */}
        <header className="flex flex-col gap-3 text-white rounded-2xl bg-[var(--primary-color)] p-5 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 text-2xl font-semibold">
              <span>Study Material</span>
              <img src="/notebook.svg" alt="notebook" className="w-8 h-8" />
            </div>

            {/* --- Right Controls --- */}
            <div className="flex items-center gap-3">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilter(true)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg backdrop-blur-sm transition"
              >
                <FiFilter className="text-lg" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              {/* Notes/PYQ Toggle */}
              <div className="flex items-center gap-2 bg-gray-300 rounded-xl overflow-hidden">
                {["notes", "pyq"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 text-sm font-medium transition-all ${viewMode === mode
                        ? "bg-[var(--primary-color)] text-white"
                        : "text-gray-800 hover:bg-gray-100"
                      }`}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm md:text-base leading-relaxed">
            Access study materials and PYQs for GATE, SSC JE, ESE, and other
            government exams. Search topics, filter by category or level, and
            download instantly.
          </p>

          {/* --- Search Bar --- */}
          <div className="mt-2 w-full md:max-w-md">
            <input
              type="text"
              placeholder={
                viewMode === "notes"
                  ? "Search by topic or exam name..."
                  : "Search by PYQ title..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl p-3 text-white border border-gray-300 focus:ring-2 focus:ring-white outline-none bg-transparent placeholder:text-gray-200"
            />
          </div>
        </header>

        {/* --- Main Grid Content --- */}
        <Suspense fallback={<div className="text-center py-10 text-gray-500">Loading...</div>}>
          <div className="flex flex-col lg:flex-row items-start gap-8 mb-14 px-2 md:px-4">

            {/* --- Main Section: Notes / PYQs --- */}
            <section className="flex-1 grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
              {viewMode === "notes" ? (
                loading ? (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    Loading study materials...
                  </div>
                ) : error ? (
                  <div className="col-span-full text-center py-10 text-red-500">
                    {error}
                  </div>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <StudyMaterialPageCard key={item._id} {...item} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    No materials found.
                  </div>
                )
              ) : pyqLoading ? (
                <div className="col-span-full text-center py-10 text-gray-500">
                  Loading PYQs...
                </div>
              ) : pyqError ? (
                <div className="col-span-full text-center py-10 text-red-500">
                  {pyqError}
                </div>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <PyqCard key={item._id} title={item.title} year={item.year} pdf={item.pdf} />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  No PYQs found.
                </div>
              )}
            </section>

            {/* --- Sidebar: Courses You Like --- */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <Suspense fallback={<div className="text-gray-500 text-center py-10">Loading courses...</div>}>
                {/* Desktop Sidebar */}
                <div className="hidden lg:block sticky top-24">
                  <CoursesYouLike title />
                </div>

                {/* Mobile / Tablet Sidebar */}
                <div className="block lg:hidden mt-8">
                  <CoursesYouLike title={false} />
                </div>
              </Suspense>
            </aside>
          </div>
        </Suspense>


        {/* --- Pagination --- */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {["Prev", "Next"].map((label, idx) => {
              const isPrev = label === "Prev";
              const disabled = isPrev ? page === 1 : page === totalPages;
              return (
                <button
                  key={label}
                  onClick={() =>
                    setPage((p) =>
                      isPrev ? Math.max(p - 1, 1) : Math.min(p + 1, totalPages)
                    )
                  }
                  disabled={disabled}
                  className={`px-4 py-2 rounded-xl ${disabled
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 border hover:bg-gray-50"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}


      </main>

      {/* --- Floating Filter Sidebar --- */}
      <AnimatePresence>
        {showFilter && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilter(false)}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="fixed z-[991] right-0 w-80 h-[70%] bg-white shadow-xl p-6 overflow-y-auto rounded-l-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowFilter(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <IoClose className="text-2xl text-gray-600" />
                </button>
              </div>

              {viewMode === "notes" && (
                <>
                  {/* Category Filter */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Category</h3>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-[var(--primary-color)]"
                    >
                      {categories.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Level Filter */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Level</h3>
                    <div className="flex flex-col gap-2">
                      {["All", "Easy", "Medium", "Hard"].map(
                        (level) => (
                          <label
                            key={level}
                            className="flex items-center gap-2 text-gray-700 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="level"
                              value={level}
                              checked={levelFilter === level}
                              onChange={(e) => setLevelFilter(e.target.value)}
                            />
                            <span>{level}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}

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

export default React.memo(StudyMaterial);
