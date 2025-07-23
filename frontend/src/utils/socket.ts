// src/lib/socket.ts
import { io } from "socket.io-client";

/// <reference types="vite/client" />
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      autoConnect: false,
      timeout: 3000,
});
