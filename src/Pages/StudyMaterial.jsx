import React, {
  useState,
  useEffect,
  useMemo,
  lazy,
  Suspense,
  useCallback,
} from "react";
import { FiFilter } from "react-icons/fi";
import { useNotesStore } from "../Zustand/GetNotes";
import { usePyqStore } from "../Zustand/GetPyq";

// Lazy components
const StudyMaterialPageCard = lazy(() =>
  import("../Component/Card/StudyMaterialPageCard")
);
const PyqCard = lazy(() => import("../Component/Card/PyqCard"));
const CoursesYouLike = lazy(() =>
  import("../Component/CoursesYouLike")
);

const ITEMS_PER_PAGE = 6;

const StudyMaterial = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("notes");
  const [showFilter, setShowFilter] = useState(false);

  const {
    notesData = [],
    loading,
    error,
    fetchNotes,
  } = useNotesStore();

  const {
    pyqData = [],
    loading: pyqLoading,
    error: pyqError,
    fetchPyq,
  } = usePyqStore();

  /* ---------------- Fetch once ---------------- */
  useEffect(() => {
    fetchNotes();
    fetchPyq();
  }, [fetchNotes, fetchPyq]);

  /* ---------------- Normalize data ---------------- */
  const allNotes = useMemo(() => {
    return notesData.flatMap((group) =>
      (group.notes || []).map((note) => ({
        ...note,
        category: group.notesCategory,
      }))
    );
  }, [notesData]);

  const allPyq = useMemo(() => {
    return pyqData.flatMap((group) =>
      (group.questionspaper || []).map((q) => ({
        ...q,
        category: group.pyqCategory,
      }))
    );
  }, [pyqData]);

  const categories = useMemo(() => {
    const unique = new Set(notesData.map((n) => n.notesCategory));
    return ["All", ...unique];
  }, [notesData]);

  /* ---------------- Filtering ---------------- */
  const filteredNotes = useMemo(() => {
    const term = search.toLowerCase();
    return allNotes.filter((item) => {
      return (
        item.title?.toLowerCase().includes(term) &&
        (categoryFilter === "All" ||
          item.category === categoryFilter)
      );
    });
  }, [allNotes, search, categoryFilter]);

  const filteredPyq = useMemo(() => {
    const term = search.toLowerCase();
    return allPyq.filter((item) =>
      item.title?.toLowerCase().includes(term)
    );
  }, [allPyq, search]);

  const currentData =
    viewMode === "notes" ? filteredNotes : filteredPyq;

  const totalPages = Math.ceil(
    currentData.length / ITEMS_PER_PAGE
  );

  const paginatedData = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return currentData.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [currentData, page]);

  /* ---------------- Reset page on change ---------------- */
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, viewMode]);

  const toggleFilter = useCallback(
    () => setShowFilter((p) => !p),
    []
  );

  return (
    <div className="relative flex flex-col gap-6 p-4 md:py-6 mb-14">
      <main className="flex flex-col gap-6">

        {/* Header */}
        <header className="rounded-2xl bg-[var(--primary-color)] p-5 text-white shadow-lg">
          <div className="flex justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 text-2xl font-semibold">
              <span>Study Material</span>
              <img src="/notebook.svg" alt="" className="w-8 h-8" />
            </div>

            <div className="flex items-center gap-3 relative">
              {/* Filter Dropdown Button */}
              {viewMode === "notes" && (
                <button
                  onClick={toggleFilter}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg"
                >
                  <FiFilter />
                  Filters
                </button>
              )}

              {/* Notes / PYQ Toggle */}
              <div className="flex bg-gray-300 rounded-xl overflow-hidden">
                {["notes", "pyq"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 text-sm font-medium ${viewMode === mode
                        ? "bg-[var(--primary-color)] text-white"
                        : "text-gray-800"
                      }`}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Filter Dropdown */}
              {showFilter && (
                <div className="absolute top-14 right-0 z-50 bg-white shadow-xl rounded-xl p-4 w-64">
                  <h4 className="text-sm font-semibold mb-2 text-gray-700">
                    Category
                  </h4>
                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(e.target.value)
                    }
                    className="w-full border rounded-lg p-2"
                  >
                    {categories.map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowFilter(false)}
                    className="mt-4 w-full py-2 bg-[var(--primary-color)] text-white rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 max-w-md">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                viewMode === "notes"
                  ? "Search notes..."
                  : "Search PYQs..."
              }
              className="w-full rounded-xl p-3 bg-transparent border text-white placeholder:text-gray-200"
            />
          </div>
        </header>

        {/* Content */}
        <Suspense fallback={<div className="py-10 text-center">Loading...</div>}>
          <div className="flex flex-col lg:flex-row gap-8">
            <section className="grid flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {viewMode === "notes" ? (
                loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : paginatedData.length ? (
                  paginatedData.map((item) => (
                    <StudyMaterialPageCard
                      key={item._id}
                      {...item}
                    />
                  ))
                ) : (
                  <p>No materials found</p>
                )
              ) : pyqLoading ? (
                <p>Loading...</p>
              ) : pyqError ? (
                <p className="text-red-500">{pyqError}</p>
              ) : paginatedData.length ? (
                paginatedData.map((item) => (
                  <PyqCard
                    key={item._id}
                    title={item.title}
                    year={item.year}
                    pdf={item.pdf}
                  />
                ))
              ) : (
                <p>No PYQs found</p>
              )}
            </section>

            {/* --- Sidebar: Courses You Like --- */} <aside className="w-full lg:w-80 flex-shrink-0"> <Suspense fallback={<div className="text-gray-500 text-center py-10">Loading courses...</div>}> {/* Desktop Sidebar */} <div className="hidden lg:block sticky top-24"> <CoursesYouLike title /> </div> {/* Mobile / Tablet Sidebar */} <div className="block lg:hidden mt-8"> <CoursesYouLike title={false} /> </div> </Suspense> </aside> </div> </Suspense>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 cursor-pointer py-2 border rounded-xl disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 cursor-pointer py-2 border rounded-xl disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default React.memo(StudyMaterial);
