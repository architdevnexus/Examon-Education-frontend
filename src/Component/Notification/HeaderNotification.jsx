import { useEffect, useMemo } from "react";
import { useNotificationStore } from "../../Zustand/useNotificationStore";

const HeaderNotification = () => {
  const { notifications, initSocket, disconnectSocket } = useNotificationStore();

  // Initialize and clean up socket connection
  useEffect(() => {
    initSocket?.();
    return () => disconnectSocket?.();
  }, [initSocket, disconnectSocket]);

  const renderedNotifications = useMemo(() => {
    if (!notifications?.length) return null;

    return notifications.map((item) => (
      <div
        key={item._id || item.title}
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

        {item.link && (
          <button
            onClick={() => window.open(item.link, "_blank", "noopener noreferrer")}
            className="font-bold cursor-pointer text-sm bg-yellow-300 text-black px-2 py-0.5 rounded-md shadow hover:scale-105 transition"
          >
            Enroll Now
          </button>
        )}
      </div>
    ));
  }, [notifications]);

  if (!notifications?.length) {
    return (
      <div className="w-full bg-[var(--primary-color)] text-white py-2 text-center opacity-80 border-b border-white/10">
        🔔 No offers available currently
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--primary-color)] text-white py-[5px] overflow-hidden border-b border-white/10 shadow-lg backdrop-blur-sm">
      <div className="marquee-wrapper relative w-full overflow-hidden">
        <div className="marquee flex gap-8 whitespace-nowrap">
          {/* Duplicate once for seamless scroll */}
          {[...renderedNotifications, ...renderedNotifications]}
        </div>
      </div>

      <style jsx>{`
        .marquee {
          display: inline-flex;
          animation: marquee 25s linear infinite;
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

        .marquee > * {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default HeaderNotification;
