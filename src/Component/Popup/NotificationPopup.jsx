import { useEffect, useState, useRef } from "react";
import NotificationPopup from "./NotificationPopupCard";
import { useNotificationStore2 } from "../../Zustand/useNotificationStore2";

const PopupManager = () => {
  const { popnotifications, initSocket } = useNotificationStore2();
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const intervalRef = useRef(null);

  useEffect(() => {
    initSocket();
  }, []);

  // When notifications arrive → take latest 5 and begin slider
  useEffect(() => {
    if (!popnotifications || popnotifications.length === 0) return;

    const timer = setTimeout(() => {
      const latestFive = popnotifications.slice(0, 5);
      setItems(latestFive);
      setCurrentIndex(0);
    }, 2000);

    return () => clearTimeout(timer);
  }, [popnotifications]);

  // Start slider rotation
  useEffect(() => {
    if (items.length === 0) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + 1 < items.length ? prev + 1 : prev
      );
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [items]);

  const handleClose = () => {
    clearInterval(intervalRef.current);
    setItems([]);
    setCurrentIndex(0);
  };

  if (items.length === 0) return null;

  return (
    <NotificationPopup
      item={items[currentIndex]}   // Pass only single item at a time
      onClose={handleClose}
    />
  );
};

export default PopupManager;
