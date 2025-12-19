// socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "https://backend.palgharhome.com";

let socket;

export const getSocket = () => {
  if (!socket) {
    console.log("🌐 Creating socket instance");

    socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"], // fallback enabled
      autoConnect: false,                   // IMPORTANT
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect_error", (err) => {
      console.error("❌ SOCKET ERROR:", err.message);
    });
  }

  return socket;
};
