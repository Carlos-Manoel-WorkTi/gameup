import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { Navbar } from "@/components/Navbar";
import Index from "./pages/Index";
import JoinRoom from "./pages/JoinRoom";
import Lobby from "./pages/Lobby";
import GamePlay from "./pages/GamePlay";
import NotFound from "./pages/NotFound";

import { socket } from "@/utils/socket"; // importa seu socket singleton

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    socket.connect();
    console.log("✅ Socket conectado");

    return () => {
      socket.disconnect();
      console.log("❌ Socket desconectado");
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/game/:gameId/join" element={<JoinRoom />} />
                <Route path="/game/:gameId/lobby/:roomCode" element={<Lobby />} />
                <Route path="/game/:gameId/play/:roomCode" element={<GamePlay />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
