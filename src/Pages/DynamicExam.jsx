import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useExamStore } from "../Zustand/GetAllExams";
import ContactSection from "../Component/ContactSection";
import DOMPurify from "dompurify";
import FAQ from "../Component/Faq/FAQ";

const DynamicExam = () => {
  const { _id: id } = useParams();
  const { exams, loading, error, fetchAllExams } = useExamStore();

  const [activeIndex, setActiveIndex] = useState(0);

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

  /** ⭐ STYLE HTML INCLUDING TABLES */
  const styledHTML = useMemo(() => {
    const html = exam.examDetails?.[activeIndex]?.Content || "";
    if (!html) return "";

    const clean = DOMPurify.sanitize(html);

    return clean
      /** TABLE WRAPPER */
      .replaceAll(
        /<table([^>]*)>/g,
        '<div class="overflow-x-auto my-6"><table$1 class="min-w-full text-sm text-left border border-gray-300 rounded-xl overflow-hidden shadow-md">'
      )
      .replaceAll(/<\/table>/g, "</table></div>")

      /** TABLE STYLES */
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

      /** LISTS & PARAGRAPHS */
      .replaceAll(/<ul>/g, '<ul class="list-disc pl-6 space-y-2 text-gray-700">')
      .replaceAll(/<ol>/g, '<ol class="list-decimal pl-6 space-y-2 text-gray-700">')
      .replaceAll(/<p>/g, '<p class="text-gray-700 leading-relaxed mb-4">')

      /** HEADINGS */
      .replaceAll(
        /<h2([^>]*)>/g,
        '<h2$1 class="text-2xl font-semibold text-gray-900 mt-8 mb-4 border-l-4 border-blue-600 pl-3">'
      )
      .replaceAll(
        /<h3([^>]*)>/g,
        '<h3$1 class="text-xl font-semibold text-gray-900 mt-6 mb-3">'
      )

      /** LINKS */
      .replaceAll(
        /<a([^>]*)>/g,
        '<a$1 class="text-blue-600 font-medium hover:underline">'
      );
  }, [activeIndex, exam]);

  const current = exam.examDetails?.[activeIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10 px-4 sm:px-6 lg:px-12">

      {/* HEADER */}
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

      {/* TABS */}
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

      {/* CONTENT AREA */}
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

        {/* ⭐ RENDER HTML WITH TABLE SUPPORT */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: styledHTML }}
        />
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <FAQ />
      </section>

      {/* CONTACT */}
      <section className="pt-10 border-t border-gray-200 mt-10">
        <ContactSection />
      </section>
    </div>
  );
};

export default DynamicExam;
