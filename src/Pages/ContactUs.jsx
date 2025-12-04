import React from "react";
import { motion } from "framer-motion";
import Hero from "../Component/Hero";
import ContactForm from "../Form/ContactUspageForm";
import Map from "../Component/Map/Map"
const ContactUs = () => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <motion.section
        className="relative z-0"
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Hero
          Title=""
          bg="/ContactUs.png"
          desc=""
          alt="Contact background image"
        />
      </motion.section>

      {/* Contact Form Section */}
      <motion.section
        className="relative z-[10] -mt-55 px-4 md:px-8 lg:px-16 py-25 flex justify-center"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
      >
        <motion.div
          className="w-full max-w-screen-xl bg-white rounded-xl shadow-lg p-6 md:p-10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
        >
          <ContactForm />
          <div className="py-2">

      <Map/>
          </div>
        </motion.div>
      </motion.section>

    </div>
  );
};

export default ContactUs;
