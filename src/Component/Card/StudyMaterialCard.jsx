import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StudyMaterialCard = ({ title, description, link, image, bgcolor, btncolor }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(link)}
            className="flex flex-col justify-between  rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 "
            style={{ backgroundColor: bgcolor }}
        >
            {/* Top Section */}
            <div className="p-6 flex flex-col gap-4 relative">
                <h3 className="text-2xl font-semibold text-[var(--primary-color)]">{title}</h3>
                <p className="text-gray-700 text-base leading-relaxed">{description}</p>
            </div>
            <img
                src={image}
                alt={title}
                className="w-52 mx-auto"
            />

            {/* Bottom Section */}
            <div className="flex items-center group">
                {/* Left White Bar */}
                <div className="flex-1 bg-gray-50 h-14"></div>

                {/* Right Colored Button */}
                <div
                    style={{
                        backgroundColor: bgcolor,
                        borderRadius: "20px"
                    }}

                    className={`p-2 `}>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(link);
                        }}
                        className="flex rounded-2xl cursor-pointer items-center justify-center gap-2 h-10 px-2 text-white font-medium transition-all duration-300 "
                        style={{ backgroundColor: btncolor }}
                    >
                        View All
                        <div
                            style={{ color: btncolor }}
                            className={` bg-white rounded-full p-1  transition-transform duration-300 group-hover:translate-x-1`}>
                            <FaArrowRight />
                        </div>

                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudyMaterialCard;
