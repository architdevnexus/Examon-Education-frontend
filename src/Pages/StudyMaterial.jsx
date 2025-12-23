import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { FiFilter } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { usePyqStore } from "../Zustand/GetPyq";
import { useNotesStore } from "../Zustand/GetNotes";

// Lazy Components
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

  const { notesData, loading, error, fetchNotes } = useNotesStore();
  const {
    pyqData,
    loading: pyqLoading,
    error: pyqError,
    fetchPyq,
  } = usePyqStore();

  useEffect(() => {
    fetchNotes();
    fetchPyq();
  }, [fetchNotes, fetchPyq]);

  /* ---------------- NOTES FLATTEN ---------------- */
  const allNotes = useMemo(() => {
    if (!Array.isArray(notesData)) return [];
    return notesData.flatMap((cat) =>
      (cat.notes || []).map((n) => ({
        ...n,
        category: cat.notesCategory,
      }))
    );
  }, [notesData]);

  /* ---------------- PYQ FLATTEN ---------------- */
  const allPyq = useMemo(() => {
    if (!Array.isArray(pyqData)) return [];
    return pyqData.flatMap((grp) =>
      (grp.questionspaper || []).map((q) => ({
        ...q,
        category: grp.pyqCategory,
      }))
    );
  }, [pyqData]);

  /* ---------------- DYNAMIC CATEGORIES ---------------- */
  const categories = useMemo(() => {
    const source = viewMode === "notes" ? allNotes : allPyq;
    return ["All", ...new Set(source.map((i) => i.category))];
  }, [viewMode, allNotes, allPyq]);

  /* ---------------- FILTERED NOTES ---------------- */
  const filteredNotes = useMemo(() => {
    return allNotes.filter((item) => {
      const matchSearch = item.title
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [allNotes, search, categoryFilter]);

  /* ---------------- FILTERED PYQ (FIXED ✅) ---------------- */
  const filteredPyq = useMemo(() => {
    return allPyq.filter((item) => {
      const matchSearch = item.title
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [allPyq, search, categoryFilter]);

  const currentData =
    viewMode === "notes" ? filteredNotes : filteredPyq;

  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const paginatedData = currentData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
    setCategoryFilter("All");
  }, [viewMode, search]);
// console.log(currentData)
  return (
    <div className="relative flex flex-col gap-6 p-4 md:py-6 mb-14">
      <main className="flex-1 flex flex-col gap-6">

        {/* HEADER */}
        <header className="relative flex flex-col gap-3 text-white rounded-2xl bg-[var(--primary-color)] p-5 shadow-lg">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex items-center gap-3 text-2xl font-semibold">
              <span>Study Material</span>
              <img src="/notebook.svg" alt="icon" className="w-8 h-8" />
            </div>

            <div className="flex items-center gap-3 relative">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilter((p) => !p)}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg"
              >
                <FiFilter />
                <span className="hidden sm:inline">Filters</span>
              </button>

              {/* Filter Dropdown */}
              {showFilter && (
                <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-lg p-4 z-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Filters
                    </h4>
                    <button onClick={() => setShowFilter(false)}>
                      <IoClose />
                    </button>
                  </div>

                  <label className="text-xs text-gray-600 mb-1 block">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full border cursor-pointer bg-(--primary-color) rounded-lg p-2"
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Toggle */}
              <div className="flex bg-gray-300 rounded-xl overflow-hidden">
                {["notes", "pyq"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className={`px-4 py-2 text-sm ${viewMode === m
                        ? "bg-[var(--primary-color)] text-white"
                        : "text-gray-800"
                      }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder={
              viewMode === "notes"
                ? "Search study material..."
                : "Search PYQ..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-3 w-full md:max-w-md p-3 rounded-xl bg-transparent border border-white/40 placeholder:text-gray-200"
          />
        </header>

        {/* --- Main Grid Content --- */} <Suspense fallback={<div className="text-center py-10 text-gray-500">Loading...</div>}> <div className="flex flex-col lg:flex-row items-start gap-8 mb-14 px-2 md:px-4"> {/* --- Main Section: Notes / PYQs --- */} <section className="flex-1 grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-4"> {viewMode === "notes" ? ( loading ? ( <div className="col-span-full text-center py-10 text-gray-500"> Loading study materials... </div> ) : error ? ( <div className="col-span-full text-center py-10 text-red-500"> {error} </div> ) : paginatedData.length > 0 ? ( paginatedData.map((item) => ( <StudyMaterialPageCard key={item._id} {...item} /> )) ) : ( <div className="col-span-full text-center py-10 text-gray-500"> No materials found. </div> ) ) : pyqLoading ? ( <div className="col-span-full text-center py-10 text-gray-500"> Loading PYQs... </div> ) : pyqError ? ( <div className="col-span-full text-center py-10 text-red-500"> {pyqError} </div> ) : paginatedData.length > 0 ? ( paginatedData.map((item) => ( <PyqCard key={item._id} title={item.title} year={item.year} pdf={item.pdf} /> )) ) : ( <div className="col-span-full text-center py-10 text-gray-500"> No PYQs found. </div> )} </section> {/* --- Sidebar: Courses You Like --- */} <aside className="w-full lg:w-80 flex-shrink-0"> <Suspense fallback={<div className="text-gray-500 text-center py-10">Loading courses...</div>}> {/* Desktop Sidebar */} <div className="hidden lg:block sticky top-24"> <CoursesYouLike title /> </div> {/* Mobile / Tablet Sidebar */} <div className="block lg:hidden mt-8"> <CoursesYouLike title={false} /> </div> </Suspense> </aside> </div> </Suspense>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              Prev
            </button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default React.memo(StudyMaterial);
