import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useBlogStore } from "../Zustand/GetBlog";
import Courses from "../Component/CoursesYouLike";

const normalizeCategory = (cat) =>
  cat?.trim()?.toLowerCase() || "general";

const Blog = () => {
  const navigate = useNavigate();
  const { blogData, fetchBlogs, loading, error } = useBlogStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const blogsPerPage = 9;

  /* ---------------- Fetch Blogs ---------------- */
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  /* ---------------- Debounce Search ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const blogs = Array.isArray(blogData) ? blogData : [];

  /* ---------------- Dynamic Categories ---------------- */
  const categories = useMemo(() => {
    const map = new Map();

    blogs.forEach((blog) => {
      const raw = blog.category || "General";
      const normalized = normalizeCategory(raw);

      if (!map.has(normalized)) {
        map.set(normalized, raw.trim());
      }
    });

    return ["All", ...Array.from(map.values())];
  }, [blogs]);

  /* ---------------- Filter Blogs ---------------- */
  const filteredBlogs = useMemo(() => {
    const normalizedCategory = normalizeCategory(category);

    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        blog.blogContent?.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesCategory =
        category === "All" ||
        normalizeCategory(blog.category) === normalizedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogs, debouncedSearch, category]);

  /* ---------------- Pagination ---------------- */
  useEffect(() => setCurrentPage(1), [debouncedSearch, category]);

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + blogsPerPage
  );

  const BlogSkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />

      <div className="p-5 space-y-3">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-10 w-full bg-gray-200 rounded-xl mt-4" />
      </div>
    </div>
  );
};


  return (
    <section className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <header className="flex flex-col justify-center px-6 md:px-12 h-[40vh] bg-[var(--primary-color)]">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-2">
          Our Course Blogs
        </h1>
        <p className="text-gray-200 max-w-2xl text-lg">
          Explore expert insights on trending technologies and real-world projects.
        </p>
      </header>

      {/* SEARCH & FILTER */}
      <motion.div
        className="relative z-10 flex justify-center -mt-10 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white shadow-xl w-full max-w-4xl rounded-2xl p-5 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="max-w-full mx-auto px-4 md:px-6 mt-14 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* BLOG LIST */}
        <div className="lg:col-span-3">
          {/* SKELETON LOADER */}
          {loading && (
            <div className="grid gap-8 sm:grid-cols-2">
              {Array.from({ length: blogsPerPage }).map((_, i) => (
                <BlogSkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* ERROR */}
          {error && !loading && (
            <div className="text-center text-red-600 mt-10">
              Failed to load blogs. Please try again later.
            </div>
          )}

          {/* BLOG GRID */}
          {!loading && !error && currentBlogs.length > 0 && (
            <>
              <div className="grid gap-8 sm:grid-cols-2">
                {currentBlogs.map((blog, index) => {
                  const createdDate = new Date(
                    blog.createdAt
                  ).toLocaleDateString();

                  const textSnippet = blog.blogContent
                    ?.replace(/<[^>]+>/g, "")
                    ?.slice(0, 120);

                  return (
                    <motion.article
                      key={blog._id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden flex flex-col"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <img
                        src={blog.featuredImage || "/placeholder.jpg"}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />

                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-sm text-gray-500 mb-2">
                          {createdDate}
                        </span>

                        <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                          {blog.title}
                        </h2>

                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                          {textSnippet || "No description available."}
                        </p>

                        <button
                          onClick={() => navigate(`/blog/${blog._id}`)}
                          className="mt-auto bg-[var(--primary-color)] text-white py-2.5 rounded-xl"
                        >
                          Read More
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-10">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Previous
                  </button>

                  <span className="font-medium">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {!loading && !error && currentBlogs.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              No blogs found matching your criteria.
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-1">
          <div className="hidden lg:block sticky top-12 bg-white rounded-2xl">
            <Courses title />
          </div>
          <div className="lg:hidden">
            <Courses title={false} />
          </div>
        </aside>
      </div>
    </section>
  );
};

export default React.memo(Blog);
