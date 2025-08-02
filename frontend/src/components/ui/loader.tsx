import React from "react";

const Loader: React.FC<{ size?: number; color?: string }> = ({
  size = 200,
  color = "#fff",
}) => {
  const wrapperStyle: React.CSSProperties = {
    width: size,
    height: 60,
    position: "relative",
    zIndex: 1,
    margin: "0 auto",
  };

  const circleBaseStyle: React.CSSProperties = {
    width: 20,
    height: 20,
    position: "absolute",
    borderRadius: "50%",
    backgroundColor: color,
    transformOrigin: "50%",
    animationName: "circleAnim",
    animationDuration: "0.5s",
    animationDirection: "alternate",
    animationIterationCount: "infinite",
    animationTimingFunction: "ease",
  };

  const shadowBaseStyle: React.CSSProperties = {
    width: 20,
    height: 4,
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.9)",
    position: "absolute",
    top: 62,
    transformOrigin: "50%",
    zIndex: -1,
    filter: "blur(1px)",
    animationName: "shadowAnim",
    animationDuration: "0.5s",
    animationDirection: "alternate",
    animationIterationCount: "infinite",
    animationTimingFunction: "ease",
  };

  return (
    <>
      <style>
        {`
          @keyframes circleAnim {
            0% {
              top: 60px;
              height: 5px;
              border-radius: 50px 50px 25px 25px;
              transform: scaleX(1.7);
            }
            40% {
              height: 20px;
              border-radius: 50%;
              transform: scaleX(1);
            }
            100% {
              top: 0%;
            }
          }

          @keyframes shadowAnim {
            0% {
              transform: scaleX(1.5);
            }
            40% {
              transform: scaleX(1);
              opacity: 0.7;
            }
            100% {
              transform: scaleX(0.2);
              opacity: 0.4;
            }
          }
          
          /* Centraliza o loader na tela */
          .loader-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.75);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }
        `}
      </style>
      <div className="loader-overlay">
        <div style={wrapperStyle}>
          <div style={{ ...circleBaseStyle, left: "15%", animationDelay: "0s" }} />
          <div style={{ ...circleBaseStyle, left: "45%", animationDelay: "0.2s" }} />
          <div style={{ ...circleBaseStyle, right: "15%", animationDelay: "0.3s" }} />

          <div style={{ ...shadowBaseStyle, left: "15%", animationDelay: "0s" }} />
          <div style={{ ...shadowBaseStyle, left: "45%", animationDelay: "0.2s" }} />
          <div style={{ ...shadowBaseStyle, right: "15%", animationDelay: "0.3s" }} />
        </div>
      </div>
    </>
  );
};

export default Loader;
