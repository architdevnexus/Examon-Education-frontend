import React, { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useCourseStore } from "../../Zustand/GetAllCourses";
import { useNavigate } from "react-router-dom";

/* -------------------- ANIMATION VARIANTS -------------------- */
const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const DHero = ({
  title,
  image,
  actualprice,
  date,
  insideCourses = [],
  perks,
  onEnroll,
  bgLeft = "/Ellipse2.svg",
  bgRight = "/Ellipse1.svg",
  badges = ["/ssc.svg"],
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCourseStore();
  const [liked, setLiked] = useState(false);

  /* -------------------- AUTH TOKEN -------------------- */
  const token = useMemo(() => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth"));
      return auth?.token || null;
    } catch {
      return null;
    }
  }, []);

  /* -------------------- LIKE HANDLER -------------------- */
  const handleLike = useCallback(() => {
    if (!token) {
      toast.info("Please login to save this batch");
      setTimeout(() => navigate("/login"), 700);
      return;
    }

    setLiked((prev) => {
      if (prev) {
        toast.warning("Removed from favorites");
        return false;
      } else {
        addToCart({ title, image });
        toast.success("Added to favorites!");
        return true;
      }
    });
  }, [token, addToCart, navigate, title, image]);

  return (
    <motion.section
      variants={fadeIn}
      initial="hidden"
      animate="show"
      className="relative flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 py-12 bg-blue-50 md:h-[80vh] overflow-hidden"
      style={{
        background: "url('/dynamicbg.svg') no-repeat center/cover",
      }}
    >
      {/* ===== Background Shapes ===== */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${bgLeft}), url(${bgRight})`,
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: "cover, contain",
          backgroundPosition: "left top, right center",
        }}
      />

      {/* ===== LEFT CONTENT ===== */}
      <motion.div variants={fadeIn} className="z-10 flex flex-col gap-6 max-w-3xl">

        {/* BADGES */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <motion.img
                key={index}
                src={badge}
                alt="badge"
                className="h-10 drop-shadow-md"
                whileHover={{ scale: 1.05 }}
                loading="lazy"
              />
            ))}
          </div>
        )}

        {/* TITLE */}
        <h1 className="text-xl md:text-3xl font-bold text-[var(--primary-color)] leading-snug drop-shadow-sm">
          {title}
        </h1>

        {/* SYLLABUS */}
        {perks && (
          <p className="text-sm font-bold text-[var(--primary-color)]">
            Syllabus: {perks}
          </p>
        )}

        {/* FACULTY */}
        {insideCourses.length > 0 && (
          <div className="flex items-center flex-wrap gap-3">
            <span className="font-semibold text-[var(--primary-color)]">
              Faculty:
            </span>
            {insideCourses.map((teacher, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white text-[var(--primary-color)] font-semibold rounded-full text-sm shadow-md"
              >
                {teacher}
              </span>
            ))}
          </div>
        )}

        {/* DATE + PRICE */}
        <motion.div variants={fadeIn} className="flex flex-col w-full sm:w-1/2 gap-3">
          {date && (
            <div
              className="flex items-center gap-3 bg-[#0071BD] shadow-md p-2 rounded-md"
              style={{ clipPath: "polygon(0 0, 90% 0, 100% 100%, 0% 100%)" }}
            >
              <span className="bg-white px-4 py-2 text-[var(--primary-color)] font-semibold">
                DATE
              </span>
              <span className="text-white font-medium">{date}</span>
            </div>
          )}

          <div
            className="flex items-center gap-3 bg-[#0071BD] shadow-md p-2 rounded-md"
            style={{ clipPath: "polygon(0 0, 90% 0, 100% 100%, 0% 100%)" }}
          >
            <span className="bg-white px-4 py-2 text-[var(--primary-color)] font-semibold">
              PRICE
            </span>
            <span className="text-white font-medium">₹ {actualprice}</span>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="flex items-center gap-4 mt-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={onEnroll}
            className="flex items-center gap-3 px-6 py-3 bg-[var(--primary-color)] text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Enroll Now
            <span className="p-2 rounded-full bg-gray-200 text-[var(--primary-color)]">
              <FaArrowRightLong />
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* ===== RIGHT IMAGE ===== */}
      <motion.div
        variants={fadeIn}
        className="z-10 w-full md:w-[40%] flex justify-center items-center mt-10 md:mt-0"
      >
        <img
          src={image}
          alt="Batch Visual"
          className="w-full max-w-md object-contain drop-shadow-3xl"
          loading="lazy"
        />
      </motion.div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-10 pointer-events-none" />
    </motion.section>
  );
};

export default React.memo(DHero);
