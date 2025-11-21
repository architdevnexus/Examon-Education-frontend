import React from "react";
import StudyMaterialCard from "./Card/StudyMaterialCard";

const StudyMaterialHome = () => {
  const studyMaterialData = [
    {
      id: 1,
      title: "Notes",
      description:
        "Comprehensive handwritten notes covering key concepts for quick revision and better understanding.",
      link: "/study-material",
      image: "./notes.svg",
      bgcolor: "#ECF3FE",
      btncolor: "#254371",
    },
    {
      id: 2,
      title: "PYQ's",
      description:
        "Access previous year question papers to analyze exam patterns and improve performance.",
      link: "/study-material",
      image: "./pyq.svg",
      bgcolor: "#FFF8EB",
      btncolor: "#CB9534",
    },
    {
      id: 3,
      title: "Quizzes",
      description:
        "Interactive quizzes to test your knowledge, reinforce concepts, and track your progress.",
      link: "/quiz",
      image: "./Quiz.svg",
      bgcolor: "#EAFFF7",
      btncolor: "#248972",
    },
  ];

  return (
    <section
      className="relative w-full py-16 px-4 sm:px-8 md:px-14 bg-gray-50 overflow-hidden"
      style={{
        background: 'url(./Ellipse1.svg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
      }}
    >
      {/* Background Decoration */}
      <img
        src="./Ellipse2.svg"
        alt=""
        className="absolute right-0 top-0 -z-0 w-1/3 opacity-80 hidden md:block"
      />

      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--primary-color)] mb-4">
          Study Material & Quiz
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed px-2">
          Access high-quality notes, previous year question papers, and interactive quizzes
          designed to help you master your subjects efficiently.
        </p>
        <div className="mt-4 mx-auto w-20 h-1 bg-[var(--primary-color)] rounded-full"></div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto relative z-10">
        {studyMaterialData.map((item, index) => (
          <div
            key={item.id}
            className="opacity-0 animate-fadeInUp"
            style={{
              animationDelay: `${index * 0.2}s`,
              animationFillMode: "forwards",
            }}
          >
            <StudyMaterialCard {...item} />
          </div>
        ))}
      </div>

      {/* Custom Animation */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out forwards;
          }
        `}
      </style>
    </section>
  );
};

export default StudyMaterialHome;
