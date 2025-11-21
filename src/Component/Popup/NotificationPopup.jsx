import { useEffect, useState, useRef } from "react";
import NotificationPopup from "./NotificationPopupCard";
import { useNotificationStore2 } from "../../Zustand/useNotificationStore2";

const PopupManager = () => {
  const { popnotifications, initSocket } = useNotificationStore2();
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    initSocket();
  }, []);

  // When notifications arrive → take latest 5 and show popup after a delay
  useEffect(() => {
    if (!popnotifications || popnotifications.length === 0) return;

    const timer = setTimeout(() => {
      const latestFive = popnotifications.slice(0, 5);
      setItems(latestFive);
      setShow(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [popnotifications]);

  const handleClose = () => {
    setShow(false);
    setItems([]);
  };

  if (!show || items.length === 0) return null;

  return <NotificationPopup items={items} onClose={handleClose} />;
};

export default PopupManager;
