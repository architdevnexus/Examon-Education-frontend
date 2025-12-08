import React from "react";
import { motion } from "framer-motion";

const BatchesCard = ({ batch }) => {
  if (!batch) return null;

  const {
    batchName,
    categoryName,
    createdAt,
    duration,
    enrollLink = "",
    images,
    price,
    syllabus,
    teachers = [],
  } = batch;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition 
                 border border-gray-100 flex flex-col overflow-hidden"
    >
      
      {/* images */}
      <div className="relative w-full h-52">
        <img
          src={images?.[1]}
          alt={batchName}
          className="w-full h-full object-cover"
        />

        {/* PRICE BADGE */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-500 
                        text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md">
          ₹{price}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-grow p-5 space-y-3">

        <h2 className="text-lg font-bold text-gray-900 leading-tight">
          {batchName}
        </h2>

        {categoryName && (
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md inline-block w-fit">
            {categoryName}
          </span>
        )}

        <p className="text-sm text-gray-700">
          <span className="font-semibold">Duration:</span> {duration}
        </p>

        <p className="text-sm text-gray-700 line-clamp-2">
          <span className="font-semibold">Syllabus:</span> {syllabus}
        </p>

        <p className="text-sm text-gray-700">
          <span className="font-semibold">Teachers:</span> {teachers.join(", ")}
        </p>

        <p className="text-xs text-gray-400">
          Added on: {new Date(createdAt).toLocaleDateString()}
        </p>

        {/* Spacer to push button down */}
        <div className="flex-grow"></div>

        {/* JOIN BUTTON FIXED AT BOTTOM */}
        <button
          onClick={() => window.open(enrollLink, "_blank")}
          className="w-full bg-[var(--primary-color)] text-white font-semibold py-2.5 rounded-xl 
                     shadow-md hover:shadow-lg hover:scale-[1.01] transition-all mt-2"
        >
          Join Now
        </button>
      </div>

    </motion.div>
  );
};

export default BatchesCard;
