import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNewsStore } from "../Zustand/GetNews";

const LatestNewsInsights = () => {
  const { news, loading, error, fetchNews } = useNewsStore();

  /** 🔹 Fetch news on mount */
  useEffect(() => {
    fetchNews();
  }, []);

  /** 🔹 Fallback static data */
  const fallbackNews = useMemo(
    () => [
      {
        _id: "1",
        image:
          "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=400&fit=crop",
        title: "SSC JE 2025 Exam postponed notification released.",
        description:
          "The SSC JE 2025 exam has been postponed due to administrative reasons. Candidates are advised to check the official website for revised dates.",
        createdAt: "2025-05-12",
      },
      {
        _id: "2",
        image:
          "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&h=400&fit=crop",
        title: "UPSC CSE 2025 Prelims application window opens.",
        description:
          "UPSC has opened the application window for CSE 2025 Prelims. Eligible candidates can apply online until June 15.",
        createdAt: "2025-05-12",
      },
      {
        _id: "3",
        image:
          "https://images.unsplash.com/photo-1581090700227-1e7b1c7b6a6b?w=800&h=400&fit=crop",
        title: "National Merit Scholarship 2025 applications now open.",
        description:
          "Students scoring above 90% in board exams can now apply for the National Merit Scholarship 2025.",
        createdAt: "2025-05-10",
      },
    ],
    []
  );

  /** 🔹 Determine which data to render */
  const validNews = useMemo(() => {
    if (Array.isArray(news?.data) && news.data.length > 0) return news.data;
    return fallbackNews;
  }, [news, fallbackNews]);

  /** 🔹 Selected news item */
  const [selectedItem, setSelectedItem] = useState(null);

  /** 🔹 Set first item as default */
  useEffect(() => {
    if (validNews.length > 0) setSelectedItem(validNews[0]);
  }, [validNews]);

  /** 🔹 Format date safely */
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-[#F9FAFB] py-12 px-4 md:px-14 rounded-2xl">
        <div className="animate-pulse text-gray-400 text-center text-lg py-12">
          Loading latest news...
        </div>
      </section>
    );
  }

  if (error) {
    console.error(" News Fetch Error:", error);
  }

  return (
    <section className="w-full bg-[#F9FAFB] py-12 px-4 sm:px-6 md:px-14 rounded-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-4xl font-bold text-[var(--primary-color)]">
              Latest News & Insights
            </h2>
            <p className="text-gray-600 max-w-4xl leading-relaxed text-base">
              Stay updated with the latest government notifications and exam-related
              insights to stay ahead of the competition.
            </p>
          </div>

          {/* Featured News */}
          {selectedItem && (
            <>
              <div className="relative w-full h-48 md:h-56 overflow-hidden rounded-2xl shadow-md">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-5">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {selectedItem.title}
                  </h3>
                  <p className="text-sm text-gray-200 line-clamp-2 mt-1">
                    {selectedItem.description}
                  </p>
                </div>
              </div>

              {/* Detailed Info */}
              <div className="bg-white shadow-sm h-72 overflow-y-auto border border-gray-100 p-4 rounded-2xl flex flex-col gap-3 scrollbar-hide">
                <span className="text-[var(--primary-color)] font-semibold text-lg">
                  {selectedItem.title}
                </span>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {selectedItem.description}
                </p>
                <span className="text-sm text-gray-500">
                  {formatDate(selectedItem.createdAt)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDE - LIST */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-4 max-h-[600px] overflow-hidden">
          <span className="text-xl font-semibold text-[var(--primary-color)]">
            Exams Related
          </span>
          <hr className="border-gray-200" />

          <div className="overflow-y-auto flex-grow scrollbar-hide pr-1">
            <section className="flex flex-col gap-5">
              {validNews.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelectedItem(item)}
                  className={`flex items-center gap-4 border border-gray-100 rounded-xl p-3 transition-all duration-300 cursor-pointer group ${selectedItem?._id === item._id
                      ? "bg-[var(--tertiary-color)]"
                      : "hover:bg-[var(--tertiary-color)]"
                    }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="flex flex-col items-start gap-1">
                    <p className="font-semibold text-gray-800 group-hover:text-[var(--primary-color)] line-clamp-2">
                      {item.title}
                    </p>
                    <span className="text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(LatestNewsInsights);
