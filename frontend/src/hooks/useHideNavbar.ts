// src/hooks/useHideNavbar.ts
import { useLocation, matchPath } from "react-router-dom";

export const useHideNavbar = () => {
  const location = useLocation();
  const hiddenRoutes = [
    "/game/:gameId/*",
    "/login",
    "/intro",
    "/splash",
  ];

  return hiddenRoutes.some((pattern) =>
    matchPath(pattern, location.pathname)
  );
};
