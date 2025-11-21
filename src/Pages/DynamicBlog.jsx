import React, { useEffect, useMemo, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { useBlogStore } from "../Zustand/GetBlog";

// Lazy load sidebar
const CoursesYouLike = lazy(() => import("../Component/CoursesYouLike"));

const DynamicBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { blogData: allBlogs = [], fetchBlogs, loading } = useBlogStore();

  // Fetch blogs only if not already loaded
  useEffect(() => {
    if (!allBlogs.length) fetchBlogs();
  }, [allBlogs.length, fetchBlogs]);

  // Memoize current blog lookup
  const blog = useMemo(() => allBlogs.find((b) => b._id === id), [allBlogs, id]);

  // Handle loading
  if (loading || !allBlogs.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg animate-pulse">Loading blog...</p>
      </div>
    );
  }

  // Handle not found
  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Blog Not Found</h2>
        <p className="text-gray-500 mb-6">
          The article you’re looking for doesn’t exist or may have been removed.
        </p>
        <button
          onClick={() => navigate("/blog")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  // Sanitize and style HTML
  const styledHTML = useMemo(() => {
    if (!blog.blogContent) return "";
    const clean = DOMPurify.sanitize(blog.blogContent);

    return clean
      .replaceAll(
        /<table([^>]*)>/g,
        '<div class="overflow-x-auto my-6"><table$1 class="min-w-full text-sm text-left border border-gray-300 rounded-xl overflow-hidden shadow-md">'
      )
      .replaceAll(/<\/table>/g, "</table></div>")
      .replaceAll(/<thead>/g, '<thead class="bg-gray-100 text-gray-800 font-semibold">')
      .replaceAll(/<tbody>/g, '<tbody class="divide-y divide-gray-200">')
      .replaceAll(/<tr>/g, '<tr class="hover:bg-gray-50 transition-colors">')
      .replaceAll(
        /<td([^>]*)>/g,
        '<td$1 class="px-4 py-3 border-b border-gray-200 text-gray-700 whitespace-nowrap">'
      )
      .replaceAll(
        /<th([^>]*)>/g,
        '<th$1 class="px-4 py-3 border-b border-gray-300 text-gray-900 font-medium bg-gray-50 whitespace-nowrap">'
      )
      .replaceAll(/<ul>/g, '<ul class="list-disc pl-6 space-y-2 text-gray-700">')
      .replaceAll(/<ol>/g, '<ol class="list-decimal pl-6 space-y-2 text-gray-700">')
      .replaceAll(/<p>/g, '<p class="text-gray-700 leading-relaxed mb-4">')
      .replaceAll(
        /<h2([^>]*)>/g,
        '<h2$1 class="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-l-4 border-blue-600 pl-3">'
      )
      .replaceAll(
        /<h3([^>]*)>/g,
        '<h3$1 class="text-xl font-semibold text-gray-900 mt-6 mb-3">'
      )
      .replaceAll(
        /<a([^>]*)>/g,
        '<a$1 class="text-blue-600 font-medium hover:underline">'
      );
  }, [blog.blogContent]);

  return (
    <motion.section
      className="min-h-screen bg-gray-50 py-10 px-4 md:px-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:text-blue-800 mb-6 text-sm font-medium transition"
      >
        ← Back to Blogs
      </button>

      <div className="flex flex-col mb-14 lg:flex-row gap-10">
        {/* Blog Section */}
        <article
          className="flex-1 bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden"
          aria-label="Blog Article"
        >
          {/* Hero Image */}
          <div className="relative w-full h-72 md:h-96 overflow-hidden">
            <img
              src={blog.featuredImage || "/placeholder.jpg"}
              alt={blog.title || "Blog Image"}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {/* Blog Content */}
          <div className="p-6 md:p-10">
            {/* Metadata */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                {blog.category || "General"}
              </span>
              <span>
                {new Date(blog.updatedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {blog.read_time && <span>• {blog.read_time}</span>}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
              {blog.title}
            </h1>

            {/* Author Info */}
            {blog.author && (
              <div className="flex items-center mb-8">
                <img
                  src={blog.author.profile_image || "/user-avatar.png"}
                  alt={blog.author.name || "Author"}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
                <div className="ml-3">
                  <p className="font-semibold text-gray-800 text-sm">
                    {blog.author.name || "Anonymous"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {blog.author.designation || ""}
                  </p>
                </div>
              </div>
            )}

            {/* Blog Body */}
            <div
              className="prose max-w-none text-gray-700 prose-headings:text-gray-900"
              dangerouslySetInnerHTML={{ __html: styledHTML }}
            />
          </div>
        </article>

        {/* Sidebar Section */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <Suspense fallback={<div className="text-gray-500">Loading courses...</div>}>
            <div className="hidden lg:block sticky top-24">
              <CoursesYouLike title />
            </div>
            <div className="block lg:hidden mt-10">
              <CoursesYouLike title={false} />
            </div>
          </Suspense>
        </aside>
      </div>
    </motion.section>
  );
};

export default React.memo(DynamicBlog);
