import { v4 as uuidv4 } from "uuid";

function getOrCreatePlayerId(): string {
  const existingId = localStorage.getItem("playerId");
  if (existingId) return existingId;

  const newId = uuidv4(); 
  localStorage.setItem("playerId", newId);
  return newId;
}

export { getOrCreatePlayerId };