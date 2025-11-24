import { useEffect } from "react";
import { useNotificationStore } from "../../Zustand/useNotificationStore";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


const HeaderNotification = () => {
  const { notifications, initSocket } = useNotificationStore();
  const Navigate = useNavigate();
  useEffect(() => {
    console.log("HeaderNotification Mounted");
    initSocket();
  }, []);

  const hasData = notifications.length > 0;

  return (
    <div className="
      w-full 
      bg-[var(--primary-color)] 
      text-white 
      py-2 
      overflow-hidden 
      shadow-lg
      backdrop-blur-sm
      border-b border-white/10
    ">
      {/* No Data */}
      {!hasData && (
        <div className="text-center text-sm py-1 opacity-80">
          🔔 No offers available currently
        </div>
      )}

      {/* Scrolling Notification Section */}
      {hasData && (
        <motion.div
          className="flex items-center gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-100%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...notifications, ...notifications, ...notifications].map((item, index) => (
            <div
              key={index}
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
              {item?.tags?.map((tag, i) => (
                <span
                  key={i}
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

              {item?.cta && (
                <button
                  className="
                    font-bold text-sm 
                    bg-yellow-300 text-black 
                    px-2 py-0.5 rounded-md 
                    shadow 
                    cursor-pointer
                    
                  "
                  onClick={() => Navigate(item?.cta?.url)}>
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
