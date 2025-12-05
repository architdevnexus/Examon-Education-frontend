import React from "react";
import { motion } from "framer-motion";

import one from "../../public/About1.png";
import two from "../../public/About2.png";
import three from "../../public/About3.png";
import four from "../../public/About4.png";
import wave from "../../public/Aboutuswave.png";

export const FourStepSelection = () => {
  const data = [
    {
      num: one,
      title: "Learn",
      desc: "Create a detailed profile highlighting your skills, experience, and career aspirations to attract potential employers.",
    },
    {
      num: two,
      title: "Practice",
      desc: "Get matched with job opportunities that align with your profile and career goals through our advanced algorithm.",
    },
    {
      num: three,
      title: "Analyze",
      desc: "Easily schedule interviews with potential employers at your convenience through our integrated scheduling system.",
    },
    {
      num: four,
      title: "Improve",
      desc: "Receive, review, and manage job offers seamlessly through our platform, ensuring you make informed career decisions.",
    },
  ];

  const cardVariant = {
    hidden: { opacity: 0, y: 30 },
    show: (i) => ({
      opacity: 1,
      y: i % 2 === 1 ? 20 : 0, // maintains your original stagger layout
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="relative min-w-full bg-white z-10 -mt-50 mb-12"
      style={{
        clipPath:
          "polygon(8% 0, 92% 0, 100% 15%, 100% 100%, 0 100%, 0 17%)",
      }}
    >
      <section className="grid grid-cols-1 min-h-[80vh] w-full overflow-hidden"

      >

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}

          className="text-center bg-white w-full py-8 text-2xl md:text-3xl text-[var(--text-color)] leading-relaxed"
        >
          A Four-step system for{" "}
          <span className="text-[var(--primary-color)] font-bold">
            Predictable Selection
          </span>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full px-4">
          {data.map((item, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={cardVariant}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className={`flex flex-col p-4 z-20 group transition-all duration-300 ${idx % 2 === 1 ? "translate-y-8 md:translate-y-20" : ""
                }`}
            >
              <div className="flex justify-end">
                <motion.img
                  src={item.num}
                  alt={item.title}
                  className="h-16 w-16 mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <h3 className="text-[var(--primary-color)] text-left text-3xl font-bold mb-2">
                {item.title}
              </h3>

              <p className="text-[var(--text-color)] text-xs leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Decorative Wave */}
        <img
          src={wave}
          alt="Wave decoration"
          className="absolute hidden md:block top-[25%] w-full h-auto opacity-40 pointer-events-none"
        />
      </section>
    </div>
  );
};
