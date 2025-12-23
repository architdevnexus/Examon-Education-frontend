import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const Whatsapp = () => {
  const phoneNumber = "+91 8368886452";
  const defaultMessage = encodeURIComponent(
    "Hello! I'm interested in your services."
  );

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 cursor-pointer"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Glowing background pulse */}
      <motion.div
        className="absolute inset-0 rounded-full bg-green-600 opacity-40 blur-xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.45, 0.3]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Button */}
      <motion.div
        className="relative bg-green-500  text-white p-4 rounded-full  flex items-center justify-center"
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <FaWhatsapp size={28} />
      </motion.div>
    </motion.div>
  );
};

export default Whatsapp;
