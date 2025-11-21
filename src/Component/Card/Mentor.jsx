import React from "react";
import { FaLinkedin } from "react-icons/fa";

const MentorCard = ({ image, name, designation, specialization, experience, linkedin }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
      <div className="h-56 w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      <div className="p-5 flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-[var(--primary-color)] font-medium">{designation}</p>
        <p className="text-sm text-gray-500 mt-1">{specialization}</p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-gray-600">{experience}</span>
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary-color)] hover:text-blue-700"
            >
              <FaLinkedin size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
