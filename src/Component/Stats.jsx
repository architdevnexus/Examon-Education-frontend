import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const Stats = ({ data }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 w-full">
      {data.map((item, index) => (
        <motion.div
          key={index}
          className="flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-4xl font-bold text-[var(--primary-color)] flex items-end gap-1">
            <CountUp
              start={0}
              end={item.num}
              duration={2.5}
              delay={0.2 * index}
              enableScrollSpy
            />
            <span className="text-4xl">{item.unit}</span>
          </h3>
          <p className="text-gray-700 text-sm md:text-base font-medium mt-1">
            {item.title}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default Stats;
