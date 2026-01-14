import React from "react";
import { motion } from "framer-motion";

const Stats = ({ data = [] }) => {
  return (
    <div className="flex flex-wrap items-center justify-start gap-6">
      {data.map((item, index) => {
        const isLast = index === data.length - 1;

        return (
          <div
            key={item.label}
            className="flex items-center gap-6"
          >
            {/* Stat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl font-extrabold text-[var(--primary-color)]">
                {item.value}
              </span>
              <span className="text-sm font-semibold text-[var(--primary-color)]">
                {item.label}
              </span>
            </motion.div>

            {/* Vertical Divider (except last) */}
            {!isLast && (
              <div className="hidden md:block h-10 w-[2px] bg-[var(--primary-color)] opacity-60" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stats;
