import React from "react";

interface BackgroundWrapperProps {
  children: React.ReactNode;
  imageUrl?: string; // permite customizar a imagem
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  children,
  imageUrl = "/capa.png",
}) => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Imagem de fundo */}
      <img
        src={imageUrl}
        alt="Fundo"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradiente escuro sobre a imagem */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-slate-900" />

      {/* Conteúdo */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundWrapper;
