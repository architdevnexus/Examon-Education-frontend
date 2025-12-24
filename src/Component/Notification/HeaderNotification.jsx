import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../../Zustand/useNotificationStore";

const HeaderNotification = () => {
  const { notifications, initSocket, disconnectSocket } = useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    initSocket();
    return () => disconnectSocket?.();
  }, [initSocket, disconnectSocket]);

  if (!notifications?.length) {
    return (
      <div className="w-full bg-[var(--primary-color)] text-white py-2 text-center opacity-80 border-b border-white/10">
        🔔 No offers available currently
      </div>
    );
  }
// console.log(notifications)
  return (
    <div className="w-full bg-[var(--primary-color)] text-white py-[5px] overflow-hidden border-b border-white/10 shadow-lg backdrop-blur-sm">
      <div className="marquee flex gap-8">
        {[...notifications, ...notifications, ...notifications, ...notifications, ...notifications, ...notifications, ...notifications, ...notifications, ...notifications, ...notifications].map((item, index) => (
          <div
            key={`${item._id || item.title}-${index}`}
            className="flex items-center gap-2 px-4 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-md hover:bg-white/20 transition duration-300 flex-shrink-0"
          >
            {item.tags?.map((tag) => (
              <span
                key={tag}
                className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-medium tracking-wide"
              >
                {tag}
              </span>
            ))}

            <span className="font-semibold text-sm md:text-base tracking-wide">{item.title}</span>

            {item.discount && (
              <span className="font-bold text-sm bg-yellow-300 text-black px-2 py-0.5 rounded-md shadow animate-pulse">
                {item.discount}% OFF
              </span>
            )}

            {item.cta?.url && (
              <button
                onClick={() => navigate(item.cta.url)}
                className="font-bold text-sm bg-yellow-300 text-black px-2 py-0.5 rounded-md shadow hover:scale-105 transition"
              >
                Enroll Now
              </button>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .marquee {
          display: flex;
          width: max-content;
          animation: marquee 55s linear infinite;
        }

        .marquee:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default HeaderNotification;
