// socket.js
import { io } from "socket.io-client";

console.log("🌐 Creating Socket Connection...");

export const socket = io("http://194.238.18.1:3004", {
  transports: ["websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

socket.on("connect_error", (err) => {
  console.log("❌ SOCKET CONNECTION ERROR:", err.message);
});

socket.on("connect", () => {
  console.log("⚡ SOCKET CONNECTED:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔌 SOCKET DISCONNECTED:", reason);
});
