import { useEffect, useMemo, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../../Zustand/useNotificationStore";

const HeaderNotification = () => {
  const { notifications, initSocket, disconnectSocket } =
    useNotificationStore();

  const navigate = useNavigate();
  const controls = useAnimation();
  const socketInitialized = useRef(false);

  /* ---------------- SAFE SOCKET INIT ---------------- */
  useEffect(() => {
    if (!socketInitialized.current) {
      initSocket();
      socketInitialized.current = true;
    }

    return () => {
      disconnectSocket?.();
      socketInitialized.current = false;
    };
  }, [initSocket, disconnectSocket]);

  const hasData = notifications?.length > 0;

  /* ---------------- DUPLICATE DATA FOR LOOP ---------------- */
  const marqueeItems = useMemo(() => {
    if (!hasData) return [];
    return [...notifications, ...notifications];
  }, [notifications, hasData]);

  /* ---------------- START MARQUEE ---------------- */
  const startAnimation = () => {
    controls.start({
      x: ["0%", "-50%"],
      transition: {
        duration: 25,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  useEffect(() => {
    if (hasData) startAnimation();
  }, [hasData]);

  return (
    <div
      className="
        w-full 
        bg-[var(--primary-color)] 
        text-white 
        py-2 
        overflow-hidden 
        shadow-lg
        backdrop-blur-sm
        border-b border-white/10
      "
    >
      {/* NO DATA */}
      {!hasData && (
        <div className="text-center text-sm py-1 opacity-80">
          🔔 No offers available currently
        </div>
      )}

      {/* INFINITE MARQUEE */}
      {hasData && (
        <motion.div
          className="flex items-center gap-12 whitespace-nowrap will-change-transform"
          animate={controls}
          onMouseEnter={() => controls.stop()}
          onMouseLeave={startAnimation}
        >
          {marqueeItems.map((item, index) => (
            <div
              key={`${item._id || item.title}-${index}`}
              className="
                flex items-center gap-4 px-4 py-1 
                rounded-lg 
                bg-white/10 
                backdrop-blur-md 
                border border-white/20 
                shadow-md 
                hover:bg-white/20 
                transition duration-300
              "
            >
              {/* TAGS */}
              {item?.tags?.map((tag) => (
                <span
                  key={tag}
                  className="
                    bg-white/20 
                    text-white 
                    px-2 py-0.5 
                    rounded-full 
                    text-xs 
                    font-medium 
                    tracking-wide
                  "
                >
                  {tag}
                </span>
              ))}

              {/* TITLE */}
              <span className="font-semibold text-sm md:text-base tracking-wide">
                {item.title}
              </span>

              {/* DISCOUNT */}
              {item.discount && (
                <span
                  className="
                    font-bold text-sm 
                    bg-yellow-300 text-black 
                    px-2 py-0.5 rounded-md 
                    shadow 
                    animate-pulse
                  "
                >
                  {item.discount}% OFF
                </span>
              )}

              {/* CTA */}
              {item?.cta?.url && (
                <button
                  onClick={() => navigate(item.cta.url)}
                  className="
                    font-bold text-sm 
                    bg-yellow-300 text-black 
                    px-2 py-0.5 rounded-md 
                    shadow 
                    hover:scale-105 
                    transition
                  "
                >
                  Enroll Now
                </button>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default HeaderNotification;
