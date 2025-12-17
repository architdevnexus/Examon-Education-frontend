import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAchievementStore } from "../Zustand/GetAchievement";

// Optimized CountUp component
const CountUp = React.memo(({ target, unit }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 1500; // 1.5 seconds
    const stepTime = 20;
    const totalSteps = Math.ceil(duration / stepTime);
    const increment = target / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="text-[var(--primary-color)]">
      {unit === "%" ? count.toFixed(0) : count}
    </span>
  );
});

// Individual number card component
const NumbCompo = React.memo(({ num, unit, text, isLast }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    }}
    className="flex items-center justify-center relative"
  >
    <div className="flex flex-col items-center text-center p-4">
      <div className="flex items-center justify-center gap-1 text-3xl sm:text-4xl font-extrabold">
        <CountUp target={num} unit={unit} />
        {unit}
      </div>
      <span className="mt-2 text-sm sm:text-base text-[var(--primary-color)] font-semibold">
        {text}
      </span>
    </div>

    {!isLast && <div className="hidden md:block h-12 w-[2px] bg-[var(--primary-color)] mx-4"></div>}
  </motion.div>
));

const HomeNumber = () => {
  const { loading, error, achievements, fetchAchievements } = useAchievementStore();

  useEffect(() => {
    fetchAchievements(); // fetch only once
  }, []);

  // Get latest achievement
  const latestAchievement = useMemo(() => {
    if (!achievements?.length) return null;
    return achievements[achievements.length - 1];
  }, [achievements]);

  // Stats to display
  const stats = useMemo(() => {
    return latestAchievement
      ? [
          { num: latestAchievement.activeUser || 0, unit: "K", text: "Active Users" },
          { num: Number(latestAchievement.satisfyUser) || 0, unit: "%", text: "Student’s Satisfaction" },
          { num: latestAchievement.courses || 0, unit: "+", text: "Courses" },
          { num: latestAchievement.passingRate || 0, unit: "%", text: "Our Selections" },
        ]
      : [
          { num: 0, unit: "K", text: "Active Users" },
          { num: 0, unit: "%", text: "Student’s Satisfaction" },
          { num: 0, unit: "+", text: "Courses" },
          { num: 0, unit: "%", text: "Our Selections" },
        ];
  }, [latestAchievement]);

  if (loading)
    return (
      <div className="w-full flex justify-center items-center py-10 text-gray-500">
        Loading achievements...
      </div>
    );

  if (error)
    return (
      <div className="w-full flex justify-center items-center py-10 text-red-500">
        Failed to load data: {error}
      </div>
    );

  return (
    <motion.div
      className="w-full flex flex-col items-center justify-center py-10"
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.15, duration: 0.6, ease: "easeOut" },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 max-w-5xl w-full justify-items-center"
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.15, duration: 0.6, ease: "easeOut" },
          },
        }}
      >
        {stats.map((item, index) => (
          <NumbCompo key={index} {...item} isLast={index === stats.length - 1} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default HomeNumber;
