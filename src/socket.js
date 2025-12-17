// socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "https://backend.palgharhome.com";

console.log("🌐 Initializing Socket...");

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],      // Force WebSocket
  reconnection: true,             // Enable automatic reconnection
  reconnectionAttempts: 10,       // Max attempts
  reconnectionDelay: 1000,        // Initial delay (ms)
  reconnectionDelayMax: 5000,     // Max delay between attempts
  autoConnect: true,              // Connect immediately
  // withCredentials: true,       // Enable if backend supports CORS with credentials
});

// Connection events
socket.on("connect", () => {
  console.log("⚡ SOCKET CONNECTED:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔌 SOCKET DISCONNECTED:", reason);
  if (reason === "io server disconnect") {
    // The server disconnected the socket, need to reconnect manually
    socket.connect();
  }
});

socket.on("connect_error", (err) => {
  console.error("❌ SOCKET CONNECTION ERROR:", err.message);
});

socket.on("reconnect_attempt", (attempt) => {
  console.log(`🔄 Reconnecting attempt #${attempt}...`);
});

socket.on("reconnect_failed", () => {
  console.error("❌ SOCKET RECONNECTION FAILED");
});

// Optional: handle custom server events
// socket.on("message", (data) => console.log("📨 Message received:", data));
