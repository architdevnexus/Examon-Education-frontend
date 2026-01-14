import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAchievementStore } from "../Zustand/GetAchievement";
import { parseStat } from "../utils/parseStat";

/* ---------------- CountUp ---------------- */
const CountUp = React.memo(({ value }) => {
  const [count, setCount] = useState(value);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    let current = 0;
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="text-[var(--primary-color)]">
      {count}
    </span>
  );
});


/* ---------------- Card ---------------- */
const StatCard = React.memo(({ num, unit, text, isLast }) => (
  <motion.div
    className="flex items-center justify-center relative"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
      },
    }}
  >
    <div className="flex flex-col items-center text-center p-4">
      <div className="flex items-center gap-1 text-3xl sm:text-4xl font-extrabold">
        <CountUp value={num} />
        {unit}
      </div>
      <span className="mt-2 text-sm sm:text-base font-semibold text-[var(--primary-color)]">
        {text}
      </span>
    </div>

    {!isLast && (
      <div className="hidden md:block h-12 w-[2px] bg-[var(--primary-color)] mx-4" />
    )}
  </motion.div>
));

/* ---------------- Main ---------------- */
const HomeNumber = () => {
  const { achievements, loading, error, fetchAchievements } =
    useAchievementStore();

  useEffect(() => {
    fetchAchievements();
  }, []);
  console.log(achievements)

  const stats = useMemo(() => {
    const latest = achievements?.at(-1);
    if (!latest) return [];

    return [
      { key: "activeUser", label: "Active Users" },
      { key: "satisfyUser", label: "Student’s Satisfaction" },
      { key: "courses", label: "Courses" },
      { key: "passingRate", label: "Our Selections" },
    ].map(({ key, label }) => ({
      ...parseStat(latest[key]),
      text: label,
    }));
  }, [achievements]);

  if (loading)
    return <div className="py-10 text-gray-500">Loading achievements...</div>;

  if (error)
    return <div className="py-10 text-red-500">{error}</div>;

  return (
    <motion.section
      className="w-full flex justify-center py-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.15 },
        },
      }}
    >
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl">
        {stats.map((item, index) => (
          <StatCard
            key={item.text}
            {...item}
            isLast={index === stats.length - 1}
          />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default HomeNumber;
