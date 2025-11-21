import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useExamStore } from "../Zustand/GetAllExams";
import ContactSection from "../Component/ContactSection";
import DOMPurify from "dompurify";
import FAQ from "../Component/Faq/FAQ";

const DynamicExam = () => {
  const { _id: id } = useParams();
  const { exams, loading, error, fetchAllExams } = useExamStore();

  const [activeIndex, setActiveIndex] = useState(0); // ⭐ TAB STATE

  useEffect(() => {
    if (!exams || exams.length === 0) fetchAllExams();
  }, [exams?.length, fetchAllExams]);

  const exam = useMemo(
    () => exams?.find((e) => String(e._id) === String(id)),
    [exams, id]
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg animate-pulse">
        Loading exam details...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">
        Error loading exam data: {error}
      </div>
    );

  if (!exam)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
        Exam not found.
      </div>
    );

  /** 🧩 Function to style HTML for each detail */
  const styleHTML = (html) => {
    if (!html) return "";

    const clean = DOMPurify.sanitize(html);

    return clean
      .replaceAll(/<p>/g, '<p class="text-gray-700 leading-relaxed mb-4">')
      .replaceAll(/<ul>/g, '<ul class="list-disc pl-6 space-y-2">')
      .replaceAll(/<ol>/g, '<ol class="list-decimal pl-6 space-y-2">');
  };

  // ⭐ CURRENT ACTIVE ITEM
  const current = exam.examDetails?.[activeIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4 sm:px-6 lg:px-12">

      {/* ===== HEADER ===== */}
      <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <img
            src={exam.logo || "/ssc.svg"}
            alt={exam.examDetailsCategory}
            className="h-12 md:h-16 w-auto object-contain"
          />
          <h1 className="text-3xl font-bold text-[var(--primary-color)]">
            {exam.examDetailsCategory.toUpperCase()} Exam Details
          </h1>
        </div>
      </section>

      {/* ⭐⭐⭐ TABS SECTION ⭐⭐⭐ */}
      <div className="flex gap-3 mb-6 border-b border-gray-200 pb-3 overflow-x-auto">
        {exam.examDetails?.map((item, index) => (
          <button
            key={item._id}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap 
              ${activeIndex === index 
                ? "bg-[var(--primary-color)] text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* ===== ACTIVE EXAM DETAIL ===== */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {current?.title}
        </h2>

        <div className="text-sm text-gray-600 mb-6">
          <p>
            Created:{" "}
            <span className="font-medium">
              {new Date(current?.createdAt).toLocaleString()}
            </span>
          </p>
          <p>
            Updated:{" "}
            <span className="font-medium">
              {new Date(current?.updatedAt).toLocaleString()}
            </span>
          </p>
        </div>

        {/* 🧩 Dynamic Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: styleHTML(current?.Content) }}
        />
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="mt-16">
        <FAQ />
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section className="pt-10 border-t border-gray-200 mt-10">
        <ContactSection />
      </section>
    </div>
  );
};

export default DynamicExam;
