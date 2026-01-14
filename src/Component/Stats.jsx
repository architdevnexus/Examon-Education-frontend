import React from "react";
import { motion } from "framer-motion";

const Stats = ({ data }) => {
  return (
    <div className="grid grid-cols-2 items-center md:grid-cols-4 gap-6 mt-6">
      {data.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center sm:w-auto"
        >
          <span className="text-2xl sm:text-3xl font-bold text-[var(--primary-color)]">
            {item.value}
          </span>
          <span className="text-sm text-gray-700 text-center sm:text-center">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Stats;
