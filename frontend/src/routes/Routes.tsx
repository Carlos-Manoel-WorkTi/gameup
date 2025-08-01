// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { useHideNavbar } from "@/hooks/useHideNavbar";
import { Navbar } from "@/components/Navbar";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import Index from "@/pages/Index";
import JoinRoom from "@/pages/JoinRoom";
import Lobby from "@/pages/Lobby";
import GamePlay from "@/pages/GamePlay";
import NotFound from "@/pages/NotFound";

const AppRoutes = () => {
  const hideNav = useHideNavbar();

  return (
    
    <BackgroundWrapper>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/game/:gameId/join" element={<JoinRoom />} />
        <Route path="/game/:gameId/lobby/:roomCode" element={<Lobby />} />
        <Route path="/game/:gameId/play/:roomCode" element={<GamePlay />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BackgroundWrapper>
  );
};

export default AppRoutes;
