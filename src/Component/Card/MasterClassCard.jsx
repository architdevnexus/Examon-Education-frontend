import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MasterClassCard = ({ desc1, desc2, bgcolor = "#0B2447" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col justify-end h-80 w-full p-5 rounded-2xl text-white shadow-lg cursor-pointer overflow-hidden transition-transform duration-300"
      style={{ backgroundColor: bgcolor }}
      onMouseEnter={() => {
        if (window.innerWidth >= 640) setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (window.innerWidth >= 640) setIsHovered(false);
      }}
      onClick={() => {
        if (window.innerWidth < 640) setIsHovered(!isHovered);
      }}
    >
      {/* Hover/Active content (desc1 + desc2) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="hover"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col justify-between p-5 rounded-2xl"
            // style={{ backgroundColor: bgcolor }}
          >
            <p className="text-sm leading-relaxed font-light text-gray-100">
              {desc1}
            </p>
            <span className="mt-4 bg-white text-sm font-semibold text-[#4C4C4C] py-2 px-3 rounded-xl text-center">
              {desc2}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Default state (desc2 always visible) */}
      {!isHovered && (
        <motion.div
          key="default"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          <span className="bg-white text-sm font-semibold text-[#4C4C4C] py-2 px-3 rounded-xl text-center block">
            {desc2}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default MasterClassCard;
