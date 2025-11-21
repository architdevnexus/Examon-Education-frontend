import React, { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCourseStore } from "../../Zustand/GetAllCourses";
import { useNavigate } from "react-router-dom";

const DHero = ({
  title,
  actualprice ,
  image,
  bgLeft = "/Ellipse2.svg",
  bgRight = "/Ellipse1.svg",
  onEnroll,
  badges = ["/ssc.svg"],
  date = "OCT 30th, 2025",
  insideCourses = []
}) => {
  const { cart, addToCart, removeFromCart } = useCourseStore();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const token = useMemo(() => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    return auth?.token;
  }, []);

  /** Handle Like / Favorite Button */
  const handleLike = useCallback(() => {
    if (!token) {
      toast.info("Please login to save this course ❤️");
      setTimeout(() => navigate("/login"), 700);
      return;
    }

    if (liked) {
      setLiked(false);
      removeFromCart(title);
      toast.warning("Removed from favorites");
    } else {
      setLiked(true);
      addToCart({ title, image });
      toast.success("Added to favorites!");
    }
  }, [liked, token, title, image, navigate, addToCart, removeFromCart]);

  // Motion Variants
  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

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

      {/* ===== Left Content ===== */}
      <motion.div
        variants={fadeIn}
        className="z-10 flex flex-col gap-6 max-w-3xl"
      >
        {/* 🎖 Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, i) => (
              <motion.img
                key={i}
                src={badge}
                alt={`badge-${i}`}
                className="h-10 drop-shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        )}

        {/* 🧾 Title */}
        <motion.h1
          className="text-xl md:text-3xl font-bold text-[var(--primary-color)] leading-snug drop-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {title}
        </motion.h1>

        {/*  Date & Time */}
        <motion.div
          variants={fadeIn}
          className="flex flex-col w-full sm:w-1/2 gap-3"
        >
          {[
            { label: "DATE", value: date },
            { label: "PRICE", value: actualprice },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-[#0071BD] shadow-md p-2 rounded-md"
              style={{
                clipPath: "polygon(0 0, 90% 0, 100% 100%, 0% 100%)",
              }}
            >
              <span className="bg-white px-4 py-2 text-[var(--primary-color)] font-semibold">
                {label}
              </span>
              <span className="text-white font-medium">  {value }</span>
            </div>
          ))}
        </motion.div>
        <div className="flex items-center flex-wrap gap-3">
          {insideCourses?.map((course, index) => (
            <span
          key={index}
          className="px-3 py-1 bg-white text-[var(--primary-color)] font-semibold rounded-full text-sm shadow-md"
        >
          {course}
        </span>
          ))
          }
        </div>

        {/*  Buttons */}
        <div className="flex items-center gap-4 mt-3">
          {/* Enroll Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onEnroll}
            className="flex items-center gap-3 px-6 py-3 bg-[var(--primary-color)] text-white rounded-full font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Enroll Now
            <motion.span
              className="p-2 rounded-full bg-gray-200 text-[var(--primary-color)]"
              whileHover={{ rotate: 20 }}
            >
              <FaArrowRightLong />
            </motion.span>
          </motion.button>

        
        </div>
      </motion.div>

      {/* ===== Right Image ===== */}
      <motion.div
        variants={fadeIn}
        className="z-10 w-full md:w-[40%] flex justify-center items-center mt-10 md:mt-0"
      >
        <motion.img
          src={image}
          alt="Course Visual"
          className="w-full max-w-md object-contain drop-shadow-3xl"
          loading="lazy"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>

      {/* ===== Subtle Overlay ===== */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-10 pointer-events-none" />
    </motion.section>
  );
};

export default React.memo(DHero);
