import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Stats from "./Stats";
import { useAchievementStore } from "../Zustand/GetAchievement";

/* ---------------- Animation ---------------- */
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

/* ---------------- Left Section ---------------- */
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

/* ---------------- Right Section ---------------- */
const RightComp = ({ stats }) => (
  <motion.div
    variants={fadeIn("left", 0.4)}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.3 }}
    className="flex flex-col items-center md:items-start justify-center gap-4 px-6 md:px-16 py-8 md:w-1/2"
  >
    <p className="text-black text-sm md:text-base leading-relaxed text-justify md:text-left">
      We offer bilingual learning in Hindi and English, accessible on app and web
      platforms, with transparent and affordable plans. Start your journey with{" "}
      <strong>Examon Education</strong> today!
    </p>

    <Stats data={stats} />
  </motion.div>
);


/* ---------------- Main Component ---------------- */
const AboutNumber = () => {
  const { fetchAchievements, loading, error, achievements } =
    useAchievementStore();

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const achievement = achievements?.[0] || {};

  /* ✅ Convert backend data → Stats-compatible format */
  const stats = useMemo(
    () => [
      {
        value: achievement.activeUser
          ? `${achievement.activeUser}`
          : "0",
        label: "Active Users",
      },
      {
        value: achievement.satisfyUser
          ? `${achievement.satisfyUser}`
          : "0%",
        label: "Student’s Satisfaction",
      },
      {
        value: achievement.courses
          ? `${achievement.courses}`
          : "0+",
        label: "Courses",
      },
      {
        value: achievement.passingRate
          ? `${achievement.passingRate}`
          : "0",
        label: "Our Selections",
      },
    ],
    [achievement]
  );

  /* ---------------- States ---------------- */
  if (loading) {
    return (
      <section className="flex justify-center items-center min-h-[50vh] bg-[var(--tertiary-color)]">
        <p className="text-gray-600">Loading achievements...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex justify-center items-center min-h-[50vh] bg-[var(--tertiary-color)]">
        <p className="text-red-500">Failed to load achievements</p>
      </section>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <section className="bg-[var(--tertiary-color)] flex flex-col md:flex-row min-h-[60vh] overflow-hidden">
      <LeftComp />
      <RightComp stats={stats} />
    </section>
  );
};

export default AboutNumber;
