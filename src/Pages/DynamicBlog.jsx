import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { useBlogStore } from "../Zustand/GetBlog";
import CategoryCourses from "../Component/CategoryCourses";

const DynamicBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { blogData = {}, fetchBlogs, loading } = useBlogStore();

  /* ------------------ FETCH BLOGS ------------------ */
  useEffect(() => {
    if (!blogData?.categories?.length && !loading) {
      fetchBlogs();
    }
  }, [blogData, loading, fetchBlogs]);

  /* ------------------ FIND BLOG ------------------ */
  const blog = useMemo(() => {
    const categories = blogData?.categories || [];
    for (const category of categories) {
      const found = category?.blogs?.find((b) => b._id === id);
      if (found) {
        return {
          ...found,
          category: category.blogCategory || "General",
        };
      }
    }
    return null;
  }, [blogData, id]);

  /* ------------------ SANITIZED CONTENT ------------------ */
  const styledHTML = useMemo(() => {
    if (!blog?.blogContent) return "";

    const cleanHTML = DOMPurify.sanitize(blog.blogContent);

    return cleanHTML
      .replace(/<table/g, '<div class="overflow-x-auto my-6"><table class="min-w-full border rounded-xl"')
      .replace(/<\/table>/g, "</table></div>")
      .replace(/<h2/g, '<h2 class="text-2xl font-semibold mt-8 mb-4"')
      .replace(/<h3/g, '<h3 class="text-xl font-semibold mt-6 mb-3"')
      .replace(/<p/g, '<p class="leading-relaxed mb-4"')
      .replace(/<ul/g, '<ul class="list-disc pl-6 space-y-2"')
      .replace(/<ol/g, '<ol class="list-decimal pl-6 space-y-2"')
      .replace(/<a/g, '<a class="text-blue-600 hover:underline"');
  }, [blog]);

  /* ------------------ LOADING / ERROR ------------------ */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="animate-pulse text-gray-500">Loading blog...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Blog not found</p>
      </div>
    );
  }

  const formattedDate = blog.updatedAt
    ? new Date(blog.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  /* ------------------ RENDER ------------------ */
  return (
    <motion.section
      className="bg-gray-50 min-h-screen px-4 md:px-10 lg:px-20 py-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-blue-600 hover:text-blue-800 transition"
      >
        ← Back to Blogs
      </button>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        {/* Blog Content */}
        <article className="bg-white rounded-3xl shadow-sm overflow-hidden">
          {/* Image */}
          <div className="h-[240px] md:h-[380px] overflow-hidden">
            <img
              src={blog.featuredImage || "/placeholder.jpg"}
              alt={blog.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="p-6 md:p-10">
            {/* Meta */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                {blog.category}
              </span>
              {formattedDate && <span>{formattedDate}</span>}
              {blog.read_time && <span>• {blog.read_time}</span>}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {blog.title}
            </h1>

            {/* Author */}
            {blog.author && (
              <div className="flex items-center gap-3 mb-8">
                <img
                  src={blog.author.profile_image || "/user-avatar.png"}
                  alt={blog.author.name}
                  className="w-12 h-12 rounded-full border object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {blog.author.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {blog.author.designation}
                  </p>
                </div>
              </div>
            )}

            {/* Body */}
            <div
              className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
              dangerouslySetInnerHTML={{ __html: styledHTML }}
            />
          </div>
        </article>

        {/* Sidebar */}
        <aside className=" h-fit">
          <CategoryCourses category={blog.category} />
        </aside>
      </div>
    </motion.section>
  );
};

export default React.memo(DynamicBlog);
