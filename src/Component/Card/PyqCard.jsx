// src/Component/Card/PyqCard.jsx
import React from "react";
import { toast } from "react-toastify";
import { FaDownload } from "react-icons/fa";

const PyqCard = ({ title, year, pdf }) => {
  const token = localStorage.getItem("token")
  const handleDownload = () => {
    if (!token) {
      toast.error("Please login to access the PYQ");
      return;
    }

    // open PDF in new tab (can also force download)
    window.open(pdf, "_blank");
  };

  return (
    <div className="bg-gradient-to-b from-[#EAF5FF] to-[#FFFFFF] shadow-xl rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition-all">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">Year: {year}</p>
      </div>

      <button
        onClick={handleDownload}
        className="mt-4 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white rounded-xl hover:bg-opacity-90 transition-all"
      >
        <FaDownload />
        <span>Download</span>
      </button>
    </div>
  );
};

export default PyqCard;
