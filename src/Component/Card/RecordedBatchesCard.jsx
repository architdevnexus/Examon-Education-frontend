import React from "react";
import { GrFormNextLink } from "react-icons/gr";

const RecordedBatchesCard = ({
  image,
  batchName,
  syllabus,
  duration,
  price,
  enrollLink,
  categoryName,
}) => {
  return (
    <div
      className="relative group overflow-hidden rounded-2xl cursor-pointer  h-[320px] transition-transform hover:scale-[1.03] shadow-xl hover:shadow-2xl"
      onClick={() => window.open("https://classplusapp.com/", "_blank")}

    >
      {/* Image */}
      <img
        src={image}
        alt={batchName}
        loading="lazy"
        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-4 flex flex-col justify-end text-white">
        <div className="space-y-2 flex">
          <div className="flex flex-col">

            <span className="text-sm text-[var(--secondary-color)] font-semibold uppercase">
              {categoryName}
            </span>
            <h3 className="text-lg  font-bold leading-snug">
              {batchName}
            </h3>
            <p className="text-sm text-white/90 line-clamp-2">{syllabus}</p>
            <p className="text-sm mt-1">Duration: {duration}</p>
          </div>
          <div className="flex flex-col">

            <p className="text-base font-semibold mt-1">Price: ₹{price}</p>
            <button
              className="mt-4 flex items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white text-sm py-2 px-4 rounded-md w-fit transition-all"
              onClick={() => window.open(batch.link || "https://classplusapp.com/", "_blank")}

            >
              View <GrFormNextLink className="text-lg" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecordedBatchesCard;
