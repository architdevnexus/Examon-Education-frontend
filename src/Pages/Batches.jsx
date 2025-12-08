import React, { useEffect, useState, useMemo } from "react";
import { useBatchesStore } from "../Zustand/GetLiveBatches";
import BatchesCard from "../Component/Card/BatchesCard";

const Batches = () => {
  const { fetchBatches, batchData, loading, error } = useBatchesStore();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    fetchBatches();
  }, []);

  // SEARCH FILTER
  const filteredData = useMemo(() => {
    return batchData.filter((batch) =>
      batch.batchName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, batchData]);

  // PAGINATION
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  console.log(paginatedData)

  return (
    <div className="w-full min-h-screen bg-gray-100 mb-14">
      
      {/* HERO SECTION */}
      <div className="bg-[var(--primary-color)] text-white py-16 px-6 shadow-lg">
        <div className="max-w-full mx-auto">
          <h1 className="text-4xl font-extrabold tracking-wide mb-3">
            Live Batches
          </h1>

          <p className="text-white/80 text-lg mb-6">
            Explore all live batches with complete syllabus, teachers & pricing.
          </p>

          {/* SEARCH BAR */}
          <input
            type="text"
            placeholder="Search for any batch..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-1/2 bg-white text-black p-3 rounded-xl shadow-md 
                       focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ERROR */}
        {error && (
          <p className="text-center text-red-600 font-medium">{error}</p>
        )}

        {/* SHIMMER LOADING */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-full h-80 bg-gray-200 animate-pulse rounded-2xl"
              ></div>
            ))}
          </div>
        )}

        {/* EMPTY SEARCH RESULT */}
        {!loading && filteredData.length === 0 && (
          <p className="text-center text-gray-600 mt-10 text-lg font-medium">
            No batches found.
          </p>
        )}

        {/* BATCH CARDS */}
        {!loading && filteredData.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedData.map((batch) => (
                <BatchesCard key={batch._id || batch.batchName} batch={batch} />
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg 
                           disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    currentPage === i + 1
                      ? "bg-[var(--primary-color)] text-white shadow-md"
                      : "bg-white text-gray-700 border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg 
                           disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Batches;
