import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

//  FAQ Data
const faqData = [
  {
    id: 1,
    question: "What is the eligibility criteria for RRB JE 2025?",
    answer:
      "Candidates must possess a Bachelor's Degree (B.E./B.Tech) or Diploma in Engineering. Age limit is 18–33 years (as on January 1, 2026). Age relaxation is available for SC/ST/OBC/Ex-Servicemen.",
  },
  {
    id: 2,
    question: "What is the application fee?",
    answer:
      "₹500 for UR/OBC/EWS and ₹250 for SC/ST/Ex-Servicemen/PwBD/Female. Refund of ₹400 (UR/OBC) or ₹250 (others) upon appearing for CBT 1.",
  },
  {
    id: 3,
    question: "How many candidates are shortlisted from CBT 1 to CBT 2?",
    answer:
      "Approximately 15 times the number of available vacancies are shortlisted. For 2,569 vacancies, approximately 38,535 candidates advance to CBT 2.",
  },
  {
    id: 4,
    question: "What is the negative marking?",
    answer:
      "1/3 mark is deducted for each incorrect answer in both CBT 1 and CBT 2.",
  },
  {
    id: 5,
    question: "Are there sectional cutoffs?",
    answer:
      "No sectional cutoffs. Only overall qualifying marks matter: 40% for UR/EWS, 30% for OBC/SC, 25% for ST.",
  },
  {
    id: 6,
    question: "What is the salary structure?",
    answer:
      "Starting salary is approximately ₹35,400 per month (Level 6 Pay Matrix) plus allowances (DA, HRA, TA).",
  },
  {
    id: 7,
    question: "What documents are required for Document Verification?",
    answer:
      "Matric Certificate, Engineering Degree/Diploma, Category Certificate, ID proof, passport-size photographs, and other relevant certificates.",
  },
  {
    id: 8,
    question: "Can I apply for multiple RRB zones?",
    answer: "No, candidates can only apply for ONE RRB zone.",
  },
  {
    id: 9,
    question: "When will CBT 1 exam be conducted?",
    answer:
      "The exact date will be announced by RRB after the application process concludes.",
  },
  {
    id: 10,
    question: "What is the job profile of RRB JE?",
    answer:
      "RRB JE positions offer technical roles with responsibility for railway operations, maintenance, and infrastructure. The position offers excellent job security, pension benefits, and career growth opportunities.",
  },
];

//  Main Component
const FAQ = () => {
  const [activeId, setActiveId] = useState(1);

  const toggleFAQ = useCallback((id) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section className="max-w-full mx-auto px-4 py-12 md:py-16">
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          Frequently Asked Questions (FAQs)
        </h2>
        <p className="text-gray-500 mt-2 max-w-3xl mx-auto text-sm md:text-base">
          Get clear answers to the most common questions about RRB JE 2025 — eligibility, process, and more.
        </p>
        <div className="bg-[var(--primary-color,#2563eb)] h-0.5 w-42 mx-auto mt-4 rounded-full" />
      </motion.div>

      {/* FAQ List */}
      <div className="divide-y divide-gray-200">
        {faqData.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: item.id * 0.05 }}
            className="py-4"
          >
            <button
              onClick={() => toggleFAQ(item.id)}
              className="flex justify-between items-center w-full text-left focus:outline-none"
            >
              <span className="flex items-center gap-3 font-semibold text-gray-800 hover:text-[var(--primary-color,#2563eb)] transition-colors duration-300">
                <span className="text-[var(--primary-color,#2563eb)] font-bold">Q{item.id}.</span>
                {item.question}
              </span>
              <motion.span
                animate={{ rotate: activeId === item.id ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="text-[var(--primary-color,#2563eb)]"
              >
                {activeId === item.id ? <FaChevronUp /> : <FaChevronDown />}
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {activeId === item.id && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 leading-relaxed text-sm md:text-base">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
