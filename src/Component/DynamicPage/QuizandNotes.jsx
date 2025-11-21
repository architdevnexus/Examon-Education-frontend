import React from "react";
import { useNavigate } from "react-router-dom";

const QuizandNotes = () => {
    const navigate = useNavigate();

    const Data = [
        {
            id: 1,
            btn: "View Notes",
            path: "/study-material",
            image: "/notes.svg",
        },
        {
            id: 2,
            btn: "Attempt Quiz",
            path: "/quiz",
            image: "/Quiz.svg",
        },
    ];

    // Component name should start with a capital letter
    const Card = ({ image, btn, path }) => (
        <div className="flex flex-col items-center gap-4">
            <img src={image} alt={btn} className="w-32 md:w-40" />
            <button
                onClick={() => navigate(path)}
                type="button"
                className="px-4 py-2 rounded-lg bg-[var(--primary-color)] text-white font-semibold shadow-md hover:opacity-90 transition-all duration-300"
            >
                {btn}
            </button>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row items-center w-full justify-around border-12 border-[#6E889B] rounded-2xl  gap-6 py-6">
            <Card {...Data[0]} />

            <span className="text-2xl md:text-4xl text-[var(--primary-color)] font-bold text-center">
                Quiz and Notes
            </span>

            <Card {...Data[1]} />
        </div>
    );
};

export default QuizandNotes;
