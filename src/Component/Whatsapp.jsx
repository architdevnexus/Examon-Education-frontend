import React, { Suspense } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useReducedMotion } from "framer-motion";

// Lazy-load motion
const MotionDiv = React.lazy(() =>
  import("framer-motion").then((mod) => ({ default: mod.motion.div }))
);

const Whatsapp = () => {
  const shouldReduceMotion = useReducedMotion();
const countryCode ="91";
  const phoneNumber = countryCode + "8368886452";
  const message = encodeURIComponent(
    "Hello! I'm interested in your services."
  );

  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50"
    >
      <Suspense fallback={null}>
        <MotionDiv
          className="relative cursor-pointer"
          whileHover={!shouldReduceMotion ? { scale: 1.15 } : undefined}
          whileTap={!shouldReduceMotion ? { scale: 0.9 } : undefined}
        >
          {/* Glow */}
          {!shouldReduceMotion && (
            <MotionDiv
              className="absolute inset-0 rounded-full bg-green-600 opacity-40 blur-xl"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.45, 0.3],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Button */}
          <MotionDiv
            className="relative bg-green-500 text-white p-4 rounded-full flex items-center justify-center"
            animate={
              !shouldReduceMotion
                ? { scale: [1, 1.08, 1] }
                : undefined
            }
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FaWhatsapp size={28} />
          </MotionDiv>
        </MotionDiv>
      </Suspense>
    </a>
  );
};

export default Whatsapp;
