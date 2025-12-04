import React from "react";

const Hero = ({ bg, Title, desc }) => {
  return (
    <section
      className="relative flex items-center justify-center md:justify-start flex-col h-[60vh] md:h-[80vh] -mt-22 gap-3 text-[var(--background-color)] bg-center bg-contain bg-no-repeat px-4 md:px-8"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      {/* Overlay (optional if you want tint later) */}
      <div className="absolute inset-0 z-10"></div>

      {/* Content */}
      <div className="relative z-20 max-w-2xl mt-20 md:mt-12 text-center md:text-left">
        <h1 className="font-bold text-2xl sm:text-3xl lg:text-5xl leading-tight">
          {Title}
        </h1>

        <p className="text-sm sm:text-base lg:text-lg mt-3 w-full md:w-3/4">
          {desc}
        </p>
      </div>
    </section>
  );
};

export default Hero;
