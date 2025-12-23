import React, { memo } from "react";
import { GrFormNextLink } from "react-icons/gr";

const RecordedBatchesCard = ({
  images = [],
  batchName,
  syllabus,
  duration,
  price,
  enrollLink,
  categoryName,
}) => {
  const safeLink = enrollLink || "https://classplusapp.com/";

  const handleOpen = (e) => {
    e.stopPropagation();
    window.open(safeLink, "_blank", "noopener,noreferrer");
  };

  const imageSrc = images?.[1] || images?.[0];

  return (
    <div
      role="button"
      onClick={handleOpen}
      className="
        relative group overflow-hidden cursor-pointer
        rounded-2xl shadow-xl hover:shadow-2xl
        w-[340px] sm:w-[360px] md:w-[460px]
        h-[330px] sm:h-[340px] md:h-[360px]
        transition-transform hover:scale-[1.015]
      "
    >
      {/* Image */}
      <img
       src={imageSrc}
  alt={batchName}
  loading="lazy"
  decoding="async"
        fetchpriority="high"
        className="
          absolute inset-0 w-full h-full
          object-cover object-center
          transition-transform duration-700
          group-hover:scale-105
          will-change-transform
        "
      />

      {/* Overlay */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-black/95 via-black/70 to-transparent
          opacity-0 group-hover:opacity-100
          transition-all duration-500
          p-4 flex flex-col justify-end text-white
        "
      >
        <div className="flex justify-between gap-3">
          {/* Left Content */}
          <div className="flex flex-col max-w-[70%]">
            <span className="text-sm font-semibold uppercase text-[var(--secondary-color)]">
              {categoryName}
            </span>

            <h3 className="text-lg font-bold leading-snug">
              {batchName}
            </h3>

            <p className="text-sm text-white/90 line-clamp-2">
              {syllabus}
            </p>

            <p className="text-sm mt-1">
              Duration: {duration}
            </p>
          </div>

          {/* Right Content */}
          <div className="flex flex-col items-end">
            <p className="text-base font-semibold mt-1">
              ₹{price}
            </p>

            <button
              onClick={handleOpen}
              className="
                mt-4 flex items-center gap-2
                bg-[var(--primary-color)]
                hover:bg-[var(--secondary-color)]
                text-white text-sm
                py-2 px-4 rounded-md
                transition-all
                cursor-pointer active:scale-95
              "
            >
              View <GrFormNextLink className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(RecordedBatchesCard);
