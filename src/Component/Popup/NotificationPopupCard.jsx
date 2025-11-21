import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotificationPopup = ({ item, onClose }) => {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "auto");
    }, []);

    const handleNavigate = () => {
        if (!item.link) return;
        onClose();
        setTimeout(() => navigate(`/${item.link}`), 250);
    };

    // Slide animation
    const slideCard = {
        hidden: { opacity: 0, x: 80 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            x: -80,
            transition: { duration: 0.4, ease: "easeIn" },
        },
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={item.id || item.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-lg 
                   flex items-center justify-center px-4"
            >
                <motion.div
                    variants={slideCard}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="
            relative rounded-3xl p-8 md:p-12 w-full max-w-5xl
            bg-gradient-to-br from-[#2D2D2D]/95 to-[#79ABCD]/95
            shadow-[0_0_50px_rgba(0,0,0,0.5)]
            border border-white/10
            flex flex-col gap-6
          "
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 bg-black/40 p-1 rounded-full 
             text-gray-300 hover:text-white hover:bg-black/60 transition"
                    >
                        <X size={12} />
                    </button>
                    <div className="flex items-center">


                        <div className="flex flex-col gap-3 items-start">

                            {/* TEXT */}
                            <h3 className="text-sm tracking-widest text-gray-400 uppercase">
                                {item.title}
                            </h3>

                            <h1 className="text-2xl font-bold text-white">{item.subtitle}</h1>

                            <p className="text-gray-300 text-base">{item.description}</p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={handleNavigate}
                                className="mt-4 px-6 py-3 w-fit rounded-full
                      bg-[var(--primary-color)] cursor-pointer hover:bg-[var(--secondary-color)]
                      text-white font-semibold shadow-lg"
                            >
                                Enroll Now →
                            </motion.button>
                        </div>
                        {/* IMAGE */}
                        <div className="relative flex justify-center">
                            <img
                                src={item.image}
                                alt="Course"
                                className="w-full h-72 rounded-2xl object-cover shadow-lg"
                            />

                            <motion.img
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: -6 }}
                                transition={{ type: "spring", stiffness: 160, damping: 10 }}
                                src="/new 1.svg"
                                className="absolute w-12 h-12 bottom-[-10px] right-[-10px]"
                            />
                        </div>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default NotificationPopup;
