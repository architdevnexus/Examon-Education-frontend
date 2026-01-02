import { useEffect, useMemo } from "react";
import { useNotificationStore } from "../../Zustand/useNotificationStore";

const HeaderNotification = () => {
  const { notifications, initSocket, disconnectSocket } =
    useNotificationStore();

  useEffect(() => {
    initSocket?.();
    return () => disconnectSocket?.();
  }, [initSocket, disconnectSocket]);

  const items = useMemo(() => {
    if (!notifications?.length) return null;

    return notifications.map((item) => (
      <div
        key={item._id || item.title}
        className="marquee-item flex items-center gap-3 px-4 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-md flex-shrink-0"
      >
        {item.tags?.map((tag) => (
          <span
            key={tag}
            className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-medium"
          >
            {tag}
          </span>
        ))}

        <span className="font-semibold text-white text-sm md:text-base">
          {item.title}
        </span>

        {item.discount && (
          <span className="font-bold text-sm bg-yellow-300 text-black px-2 py-0.5 rounded-md animate-pulse">
            {item.discount}% OFF
          </span>
        )}

        {item.link && (
          <button
            onClick={() =>
              window.open(item.link, "_blank", "noopener,noreferrer")
            }
            className="font-bold cursor-pointer text-sm bg-yellow-300 text-(--primary-color) px-2 py-0.5 rounded-md hover:scale-105 transition"
          >
            Enroll Now
          </button>
        )}
      </div>
    ));
  }, [notifications]);

  if (!notifications?.length) {
    return (
      <div className="w-full bg-[var(--primary-color)] text-white py-2 text-center opacity-80">
        🔔 No offers available currently
      </div>
    );
  }

  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        <div className="marquee-content">{items}</div>
        <div className="marquee-content">{items}</div>
      </div>
    </div>
  );
};

export default HeaderNotification;
