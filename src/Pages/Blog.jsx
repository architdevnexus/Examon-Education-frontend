import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useBlogStore } from "../Zustand/GetBlog";
import Courses from "../Component/CoursesYouLike";

const Blog = () => {
  const navigate = useNavigate();
  const { blogData, fetchBlogs, loading, error } = useBlogStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  // Fetch blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const blogs = Array.isArray(blogData) ? blogData : [];

  // Extract unique categories
  const categories = useMemo(() => {
    const unique = new Set(blogs.map((b) => b.category || "General"));
    return ["All", ...unique];
  }, [blogs]);

  // Filter blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        blog.blogContent?.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory = category === "All" || blog.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [blogs, debouncedSearch, category]);

  // Reset pagination when filters change
  useEffect(() => setCurrentPage(1), [debouncedSearch, category]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + blogsPerPage);

  return (
    <section className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <header className="flex flex-col justify-center px-6 md:px-12 h-[40vh] bg-[var(--primary-color)] text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-2">
          Our Course Blogs
        </h1>
        <p className="text-gray-200 max-w-2xl text-lg mx-auto md:mx-0">
          Explore expert insights on trending technologies and real-world projects.
        </p>
      </header>

      {/* SEARCH & FILTER — centered floating box */}
      <motion.div
        className="relative z-10 flex justify-center -mt-10 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-white shadow-xl w-full max-w-4xl rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--primary-color)] outline-none text-gray-700"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[var(--primary-color)] outline-none text-gray-700"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="max-w-full mx-auto px-4 md:px-6 mt-14 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* BLOG LIST */}
        <div className="lg:col-span-3">
          {/* LOADING */}
          {loading && (
            <div className="flex justify-center items-center mt-10">
              <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-[var(--primary-color)] rounded-full"></div>
              <p className="ml-3 text-gray-600">Loading blogs...</p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="text-center text-red-600 mt-10">
              Failed to load blogs. Please try again later.
            </div>
          )}

          {/* BLOG GRID */}
          {!loading && !error && currentBlogs.length > 0 ? (
            <>
              <div className="grid gap-8 sm:grid-cols-2">
                {currentBlogs.map((blog, index) => {
                  const createdDate = new Date(blog.createdAt).toLocaleDateString();
                  const textSnippet = blog.blogContent
                    ?.replace(/<[^>]+>/g, "")
                    ?.slice(0, 120);

                  return (
                    <motion.article
                      key={blog._id || index}
                      className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <img
                        src={blog.featuredImage || "/placeholder.jpg"}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                      <div className="flex flex-col flex-1 p-5">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                          <span>{createdDate}</span>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                          {blog.title}
                        </h2>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {textSnippet || "No description available."}
                        </p>
                        <button
                          onClick={() => navigate(`/blog/${blog._id}`)}
                          className="mt-auto bg-[var(--primary-color)] text-white text-sm font-medium py-2.5 rounded-xl transition hover:opacity-90"
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
                <div className="flex justify-center items-center gap-3 mt-10">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-white hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    Previous
                  </button>

                  <span className="text-gray-600 font-medium">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-white hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            !loading &&
            !error && (
              <div className="text-center text-gray-500 mt-10">
                No blogs found matching your criteria.
              </div>
            )
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="hidden lg:block sticky top-12 bg-white rounded-2xl">
            <Courses title={true} />
          </div>
          <div className="block lg:hidden">
            <Courses title={false} />
          </div>
        </aside>
      </div>
    </section>
  );
};

export default React.memo(Blog);
