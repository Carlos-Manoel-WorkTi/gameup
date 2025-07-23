import { useEffect } from "react";
import { io } from "socket.io-client";



export default function Test(){
    useEffect(() => {
        const socket = io("http://localhost:3001", {
  path: "/socket.io",
  transports: ["websocket","polling"],
  reconnectionAttempts: 5,
  timeout: 3000,
});

socket.on("connect", () => {
  console.log("🔌 Conectado ao servidor, id:", socket.id);
  console.log("✅ Conectado! Socket ID:", socket.id);

});

socket.on("olá", (msg: string) => {
  console.log("📨 Mensagem do servidor:", msg);
  socket.disconnect();
});

socket.on("connect_error", err => {
  console.error("❌ Erro ao conectar:", err.message);
});
    })
};