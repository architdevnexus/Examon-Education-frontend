import React from "react";
import { motion } from "framer-motion";
import ContactForm from "../Form/ContactForm";
import { MdEmail } from "react-icons/md";
import { IoCallSharp } from "react-icons/io5";

const ContactSection = () => {
  // Animation Variants
  const containerVariant = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeInVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="w-full mb-12 px-6 md:px-8">
      <motion.div
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
      >
        {/* 🔹 Left Content */}
        <motion.div
          variants={fadeUpVariant}
          className="flex flex-col justify-center space-y-6"
        >
          <div>
            <motion.p
              variants={fadeUpVariant}
              className="text-[var(--text-color)] text-sm tracking-widest uppercase mb-2"
            >
              We're Here to Help You
            </motion.p>
            <motion.h2
              variants={fadeUpVariant}
              className="text-3xl md:text-4xl font-bold text-[var(--primary-color)] leading-snug"
            >
              Discuss Your Course Related Queries
            </motion.h2>
            <motion.p
              variants={fadeUpVariant}
              className="text-gray-600 mt-3 text-base"
            >
              Are you looking for top-quality courses and batches?
              <br />
              Reach out to us and our team will guide you through your journey.
            </motion.p>
          </div>

          {/* 🔸 Contact Info */}
          <motion.div
            variants={containerVariant}
            className="space-y-6"
          >
            {/* Email */}
            <motion.div
              variants={fadeUpVariant}
              className="flex items-center gap-4 rounded-xl p-4 hover:bg-gray-50 transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-[var(--secondary-color)] text-white p-4 rounded-full text-2xl flex items-center justify-center shadow-md"
              >
                <MdEmail />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-[var(--text-color)] text-sm font-medium">Email</span>
                <span className="text-[var(--secondary-color)] font-semibold text-lg">
                  help@gmail.com
                </span>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              variants={fadeUpVariant}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-all duration-300"
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-[var(--secondary-color)] text-white p-4 rounded-full text-2xl flex items-center justify-center shadow-md"
              >
                <IoCallSharp />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-[var(--text-color)] text-sm font-medium">
                  Phone Number
                </span>
                <span className="text-[var(--secondary-color)] font-semibold text-lg">
                  9852981212
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* 🔹 Right Form */}
        <motion.div
          variants={fadeInVariant}
          className="w-full"
        >
          <ContactForm />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
