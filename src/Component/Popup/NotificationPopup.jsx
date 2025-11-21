import React, { useEffect, useState } from "react";
import { useNotificationStore2 } from "../../Zustand/useNotificationStore2";

const PopupManager = () => {
  const { popnotifications, initSocket } = useNotificationStore2();
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    initSocket();
  }, []);

  useEffect(() => {
    if (popnotifications.length > 0) {
      setCurrent(popnotifications[0]); // show latest
    }
  }, [popnotifications]);

  const closePopup = () => {
    setCurrent(null);
  };

  if (!current) return null;

  return (
    <NotificationPopup
      title={current.title}
      subtitle={current.subtitle}
      description={current.description}
      img={current.img}
      path={current.path}
      onClose={closePopup}
    />
  );
};

export default PopupManager;
