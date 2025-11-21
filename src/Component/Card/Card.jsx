import React from "react";

const Card = ({ 
  title = "VISION", 
  bgImage = "/path/to/lightbulb.jpg", 
  icon = "/path/to/eye-icon.svg", 
  description = "Lorem ipsum dolor sit amet consectetur adipiscing elit mattis sit phasellus mollis sit aliquam sit nullam neque ultrices.", 
  accentColor = "#e74c3c" 
}) => {
  return (
    <div className="w-72 md:w-80 bg-white rounded-2xl overflow-hidden shadow-md hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
      
      {/* 🔹 Top section with gradient and title */}
      <div
        className="h-36 relative flex items-center justify-center text-white font-bold text-2xl"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0  opacity-85"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,0.3), ${accentColor})`,
          }}
        ></div>
        <span className="relative z-10 tracking-wider">{title}</span>
      </div>

      {/* 🔹 Hexagon Icon */}
      <div className="flex  justify-center -mt-10">
        <div
          className="w-20 h-20 flex items-center justify-center shadow-lg"
          style={{
            backgroundColor: accentColor,
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <img src={icon} alt={`${title} icon`} className="w-10 h-10" />
        </div>
      </div>

      {/* 🔹 Description Section */}
      <div className="px-6 py-4 text-center">
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default Card;
