import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAchievementStore } from "../Zustand/GetAchievement";

const HomeNumber = () => {
  const { loading, error, achievements, fetchAchievements } = useAchievementStore();

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);
// console.log(achievements);
  //  If multiple entries exist, take the latest one
  const latestAchievement = useMemo(() => {
    if (!achievements?.length) return null;
    return achievements[achievements.length - 1];
  }, [achievements]);

  //  Fallback if no API data
  const stats = latestAchievement
    ? [
        { num: latestAchievement.activeUser || 0, unit: "K", text: "Active Users" },
        { num: Number(latestAchievement.satisfyUser) || 0, unit: "%", text: "Customer Satisfaction" },
        { num: latestAchievement.courses || 0, unit: "+", text: "Courses" },
        { num: latestAchievement.passingRate || 0, unit: "%", text: "Passing Rate" },
      ]
    : [
        { num: 0, unit: "K", text: "Active Users" },
        { num: 0, unit: "%", text: "Customer Satisfaction" },
        { num: 0, unit: "+", text: "Courses" },
        { num: 0, unit: "%", text: "Passing Rate" },
      ];

  // Framer motion animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15, duration: 0.6, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  //  Count-Up Animation
  const CountUp = ({ target }) => {
    const [count, setCount] = useState(0);
    const { ref, inView } = useInView({ triggerOnce: true });

    useEffect(() => {
      if (inView) {
        let start = 0;
        const duration = 1500;
        const stepTime = 20;
        const increment = target / (duration / stepTime);

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            clearInterval(timer);
            start = target;
          }
          setCount(Math.floor(start));
        }, stepTime);

        return () => clearInterval(timer);
      }
    }, [inView, target]);

    return (
      <span ref={ref} className="text-[var(--primary-color)]">
        {count}
      </span>
    );
  };

  //  Individual Stat Component
  const NumbCompo = ({ num, unit, text, isLast }) => (
    <motion.div
      variants={itemVariants}
      className="flex items-center justify-center relative"
    >
      <div className="flex flex-col items-center text-center p-4">
        <div className="flex items-center justify-center gap-1 text-3xl sm:text-4xl font-extrabold">
          <CountUp target={num} />
          {unit}
        </div>
        <span className="mt-2 text-sm sm:text-base text-[var(--primary-color)] font-semibold">
          {text}
        </span>
      </div>
      {!isLast && (
        <div className="hidden md:block h-12 w-[2px] bg-[var(--primary-color)] mx-4"></div>
      )}
    </motion.div>
  );

  //  Render States
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
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 max-w-5xl w-full justify-items-center"
        variants={containerVariants}
      >
        {stats.map((item, index) => (
          <NumbCompo
            key={index}
            {...item}
            isLast={index === stats.length - 1}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default HomeNumber;
