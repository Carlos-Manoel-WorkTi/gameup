// import { Button } from "@/components/ui/button";
// import { Play, CheckCircle } from "lucide-react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { useGameSocket } from "@/hooks/useGameSocket";

// interface Props {
//   isHost: boolean;
//   roomCode: string;
//   gameId: string;
//   nickname: string;
//   isSolo: boolean;
//   startGame: () => void;
//   player: {
//     id: string;
//     name: string;
//   };
// }

// export function GameActionButton({
//   isHost,
//   roomCode,
//   gameId,
//   nickname,
//   isSolo,
//   startGame,
//   player
// }: Props) {
//   const navigate = useNavigate();

//   const handleStartGame = () => {
//     startGame();
//     navigate(`/game/${gameId}/play/${roomCode}`, {
//       state: { nickname, isHost, isSolo },
//     });
//   };

//   const handleReady = () => {
//     // Emitir que o jogador está pronto (deve estar implementado no backend)
//     socket.emit("player_ready", {
//       roomId: roomCode,
//       playerId: player.id,
//     });
//   };

//   return isHost ? (
//     <Button
//       onClick={handleStartGame}
//       className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 text-lg"
//     >
//       <Play className="w-5 h-5 mr-2" />
//       Iniciar Jogo
//     </Button>
//   ) : (
//     <Button
//       onClick={handleReady}
//       className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 text-lg"
//     >
//       <CheckCircle className="w-5 h-5 mr-2" />
//       Estou Pronto
//     </Button>
//   );
// }
