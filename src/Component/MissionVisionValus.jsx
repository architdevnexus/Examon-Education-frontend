import React from "react";
import { motion } from "framer-motion";
import Card from "./Card/Card";

const MissionVisionValues = () => {
  const cards = [
    {
      title: "VISION",
      bgImage: "https://res.cloudinary.com/dt4ohfuwc/image/upload/v1762755958/light-bulb-with-drawing-graph_1_ty8gml.png",
      icon: "/vision.svg",
      description:
        "We envision a world where learning is accessible, innovative, and empowers every student to achieve their true potential.",
      accentColor: "#EB3F57",
    },
    {
      title: "MISSION",
      bgImage: "https://res.cloudinary.com/dt4ohfuwc/image/upload/v1762755958/33_2_cmlg0i.png",
      icon: "/mission.svg",
      description:
        "Our mission is to empower learners through dynamic, bilingual, and affordable education — accessible anytime, anywhere.",
      accentColor: "#2EA7D6",
    },
    {
      title: "VALUES",
      bgImage: "https://res.cloudinary.com/dt4ohfuwc/image/upload/v1762755958/5878303_1_rpir2y.png",
      icon: "/values.svg",
      description:
        "Integrity, inclusivity, and innovation drive everything we do — ensuring a culture of continuous growth and impact.",
      accentColor: "#EC8A2C",
    },
  ];

  return (
    <section className="min-w-full py-16 px-6 md:px-8 overflow-hidden">
      {/* 🔹 Header Animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-left mb-12"
      >
        <h2 className="text-lg md:text-xl text-gray-700">
          Examon Education’s
        </h2>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary-color)]">
          Mission, Vision & Values
        </h1>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          transition={{ duration: 1 }}
          className="h-1 bg-[var(--primary-color)] mt-3 rounded-full"
        ></motion.div>
      </motion.div>

      {/* 🔹 Animated Cards */}
      <div className="flex flex-wrap justify-center gap-10">
        {cards.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: idx * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="transition-transform duration-300"
          >
            <Card {...item} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MissionVisionValues;
