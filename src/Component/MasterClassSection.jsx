import React from "react";
import MasterClassCard from "./Card/MasterClassCard";

const MasterClassSection = () => {
    const MasterClassData = [
        {
            id: 1,
            desc1:
                "This course helps you bridge the gap between theory and practical exam application.",
            desc2: "Diploma and B.Tech Students (Civil, Mechanical, Electrical)",
            bgcolor: "#BDAAE4", // deep navy blue
        },
        {
            id: 2,
            desc1:
                "You’ll get topic-wise quizzes, structured study notes, and mock tests to assess your progress and improve speed and accuracy with every session.",
            desc2: "Aspirants Targeting SSC JE 2025 / 2026",
            bgcolor: "#81B9C4", // rich indigo tone
        },
        {
            id: 3,
            desc1:
                "This course includes revision sheets, mock practice sessions, and doubt-solving discussions, helping you revise smarter, not harder before the exam.",
            desc2: "Full-Course Revision and Smart Practice",
            bgcolor: "#EC8A2C", // vibrant violet
        },
        {
            id: 4,
            desc1:
                "The flexible video lectures, recorded sessions, and quick revision materials allow you to prepare at your own pace — without disturbing your job schedule.",
            desc2: "Working Professionals Seeking Government Jobs",
            bgcolor: "#070D2C", // dark blue-cyan tone
        },
    ];
    return (
        <section className="flex flex-col items-center justify-center w-full py-12 bg-white">
            {/* Section Header */}
            <div className="text-center w-full px-4 sm:px-8 md:px-0 md:w-2/3 lg:w-1/2 mb-8">
                <p className="text-[#909090] text-sm sm:text-base mb-1">
                    Who should enroll for the
                </p>
                <h2 className="font-bold text-[var(--primary-color)] text-2xl sm:text-3xl">
                    Masterclass
                </h2>
                <div className="mt-2 w-16 sm:w-20 h-[3px] bg-[var(--primary-color)] mx-auto rounded-full" />
            </div>

            {/* Cards Grid */}
            <div
                className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 
          w-full px-4 sm:px-6 md:px-8 lg:px-12
          max-w-full
          transition-all duration-300
        "
            >
                {MasterClassData?.length > 0 ? (
                    MasterClassData.map((item, index) => (
                        <MasterClassCard
                            key={index}
                            desc1={item.desc1}
                            desc2={item.desc2}
                            bgcolor={item.bgcolor}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-400 py-10">
                        No data available
                    </div>
                )}
            </div>
        </section>
    );
};

export default MasterClassSection;
