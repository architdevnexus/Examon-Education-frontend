import React from "react";
import { useNavigate } from "react-router-dom";
import { CiStopwatch } from "react-icons/ci";
import { SiLevelsdotfyi, SiTicktick } from "react-icons/si";
import { TbMessage2Question } from "react-icons/tb";

const ExamCard = ({ examData }) => {
  const navigate = useNavigate();
  const { _id, title, exam, duration, totalMarks, tags } = examData;

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins} min`;
  };
  const token = localStorage.getItem("token");
  const handleNAvigate = () => {
    if (token) {
      navigate(`/quiz/${_id}`);
    } else {
      navigate("/login");
    }
  }
  return (
    <div
      onClick={() => handleNAvigate()}
      className="cursor-pointer bg-gradient-to-b from-[#EAF5FF] to-white shadow-md hover:shadow-lg rounded-2xl flex flex-col justify-between overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="p-5 flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[var(--primary-color)] leading-snug line-clamp-2">
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <SiLevelsdotfyi className="text-[var(--primary-color)] text-lg" />
            <span>{exam}</span>
          </div>

          <div className="flex items-center gap-2">
            <CiStopwatch className="text-[var(--primary-color)] text-lg" />
            <span>{formatDuration(duration)}</span>
          </div>

          <div className="flex items-center gap-2">
            <TbMessage2Question className="text-[var(--primary-color)] text-lg" />
            <span>{totalMarks} Marks</span>
          </div>

          <div className="flex items-center gap-2">
            <SiTicktick className="text-[var(--primary-color)] text-lg" />
            <span>Ready</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {tags?.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-[var(--primary-color)] text-xs font-medium px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-[var(--primary-color)] py-3 px-4 flex justify-center">
        <button
          className="w-full sm:w-3/4 bg-white text-[var(--primary-color)] font-semibold py-2 rounded-lg shadow-sm hover:bg-[var(--secondary-color)] hover:text-white transition-all duration-300"
        >
          Start Now
        </button>
      </div>
    </div>
  );
};

export default ExamCard;
