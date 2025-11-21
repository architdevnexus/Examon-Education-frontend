import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Stats from "./Stats";
import { useAchievementStore } from "../Zustand/GetAchievement";

/**
 * 🎯 Animation Utility
 * Generates consistent fade-in variants for Framer Motion
 */
const fadeIn = (direction = "up", delay = 0) => ({
  hidden: {
    opacity: 0,
    y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
    x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  },
});

/**
 * 🧱 Left Component - About Text & Quote
 */
const LeftComp = () => (
  <motion.div
    variants={fadeIn("right", 0.2)}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.3 }}
    className="flex flex-col items-start gap-4 px-6 md:px-16 py-10 md:w-1/2"
  >
    <motion.img
      src="/double.svg"
      alt="quote"
      className="w-8 h-8 mb-2"
      initial={{ rotate: -10, opacity: 0 }}
      whileInView={{ rotate: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    />
    <p className="text-gray-800 text-md md:text-lg leading-relaxed font-medium">
      We help serious aspirants turn disciplined preparation into consistent results.
    </p>
  </motion.div>
);

/**
 * 🧱 Right Component - Text & Stats
 */
const RightComp = ({ data }) => (
  <motion.div
    variants={fadeIn("left", 0.4)}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.3 }}
    className="flex flex-col items-start justify-center gap-6 px-6 md:px-16 py-10 md:w-1/2"
  >
    <p className="text-black text-sm md:text-base leading-relaxed">
      We offer bilingual learning in Hindi and English, accessible on app and web platforms,
      with transparent, affordable plans. Start your journey with{" "}
      <strong>Examon Education</strong> today!
    </p>

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className="w-full"
    >
      <Stats data={data} />
    </motion.div>
  </motion.div>
);

/**
 * Main AboutNumber Component
 */
const AboutNumber = () => {
  const { fetchAchievements, loading, error, achievements } = useAchievementStore();

  // Fetch Achievements on Mount (only once)
  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);
  // console.log(achievements);

  // Extract first item safely
  const achievement = achievements?.[0] || {};

  // Prepare safe data for Stats component
  const data = [
    { num: achievement.activeUser || 0, unit: "M+", title: "Students" },
    { num: achievement.courses || 0, unit: "+", title: "Courses" },
    { num: achievement.Instructors || 20, unit: "%", title: "Instructors" },
    { num: achievement.alumni || 0, unit: "K+", title: "Alumni" },
  ];

  // Loading / Error UI
  if (loading) {
    return (
      <section className="flex justify-center items-center min-h-[50vh] bg-[var(--tertiary-color)] text-gray-600">
        <p>Loading achievements...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex justify-center items-center min-h-[50vh] bg-[var(--tertiary-color)] text-red-500">
        <p>Failed to load achievements: {error}</p>
      </section>
    );
  }

  // ✅ Main UI
  return (
    <section className="bg-[var(--tertiary-color)] flex flex-col md:flex-row justify-between items-stretch min-h-[60vh] overflow-hidden">
      <LeftComp />
      <RightComp data={data} />
    </section>
  );
};

export default AboutNumber;
