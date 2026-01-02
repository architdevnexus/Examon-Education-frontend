import React, { memo } from "react";

const Hero = ({
  bg = "",
  title = "",
  desc = "",
  overlay = false
}) => {
  return (
    <section
      className={`relative flex flex-col items-center md:items-start justify-center h-80 md:h-[80vh] -mt-24 gap-3 text-[var(--background-color)] bg-center bg-contain bg-no-repeat px-4 md:px-8`}
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Optional overlay */}
      {overlay && <div className="absolute inset-0 z-10 bg-black/30"></div>}

      {/* Content */}
      <div className="relative z-20 max-w-2xl mt-20 md:mt-12 text-center md:text-left">
        <h1 className="font-bold text-2xl sm:text-3xl lg:text-5xl leading-tight">
          {title}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg mt-3 w-full md:w-3/4">
          {desc}
        </p>
      </div>
    </section>
  );
};

// Prevent unnecessary re-renders
export default memo(Hero);
