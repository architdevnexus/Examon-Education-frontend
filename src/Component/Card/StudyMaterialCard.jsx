import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StudyMaterialCard = ({ title, description, link, image, bgcolor, btncolor }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(link)}
            className="
                flex flex-col justify-between rounded-2xl overflow-hidden cursor-pointer 
                transition-all duration-300 
                h-[450px] max-h-[450px]   /* ✅ FIXED HEIGHT */
            "
            style={{ backgroundColor: bgcolor }}
        >
            {/* Top Section */}
            <div className="p-6 flex flex-col gap-4 relative h-[200px] overflow-hidden">
                <h3 className="text-2xl font-semibold text-[var(--primary-color)] line-clamp-2">
                    {title}
                </h3>

                <p className="text-gray-700 text-base leading-relaxed line-clamp-3">
                    {description}
                </p>
            </div>

            {/* Fixed Image Space */}
            <div className="flex items-center justify-center h-[130px]">
                <img
                    src={image}
                    alt={title}
                    className="w-52 object-contain"
                />
            </div>

            {/* Bottom Section */}
            <div className="flex items-center group h-[70px]">
                {/* Left White Bar */}
                <div className="flex-1 bg-gray-50 h-full"></div>

                {/* Right Colored Button */}
                <div
                    style={{
                        backgroundColor: bgcolor,
                        borderRadius: "20px"
                    }}
                    className="p-2"
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(link);
                        }}
                        className="flex cursor-pointer rounded-2xl items-center justify-center gap-2 h-10 px-2 text-white font-medium transition-all duration-300"
                        style={{ backgroundColor: btncolor }}
                    >
                        View All
                        <div
                            style={{ color: btncolor }}
                            className="bg-white rounded-full p-1 transition-transform duration-300 group-hover:translate-x-1"
                        >
                            <FaArrowRight />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudyMaterialCard;
