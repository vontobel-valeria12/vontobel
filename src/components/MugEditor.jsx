import React, { memo } from "react";

// Importações dos seus assets reais
import maskStandard from "../assets/topImg.png";
import reflexoStandard from "../assets/reflexo-caneca.png";
import backImg from "../assets/back.png"; 

const MugEditor = memo(({ layoutId, userImg, asset }) => {
  
  // Define se é Magic para aplicar o filtro escuro
  const isMagic = layoutId === "magic";

  return (
    <section style={{
      position: "relative",
      width: "100%",
      aspectRatio: "1/1",
      backgroundColor: "#FFFFFF",
      overflow: "hidden"
    }}>
      {/* CAMADA 1: FUNDO (back.png) */}
      <img
        src={backImg}
        alt="Basis"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          zIndex: 5,
          filter: isMagic ? "brightness(0.2) grayscale(1)" : "none",
          transition: "filter 0.3s ease" // Transição suave para a Magic Mug
        }}
      />

      {/* CAMADA 2: FOTO DO USUÁRIO COM MÁSCARA */}
      {userImg && (
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          WebkitMaskImage: `url(${maskStandard})`,
          maskImage: `url(${maskStandard})`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center"
        }}>
          <img
            src={userImg}
            alt="Arte"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transform: `scale(${asset?.scale || 1}) translate(${asset?.x || 0}px, ${asset?.y || 0}px)`,
              mixBlendMode: isMagic ? "screen" : "multiply"
            }}
          />
        </div>
      )}

      {/* CAMADA 3: REFLEXO (Sempre por cima) */}
      <img
        src={reflexoStandard}
        alt="Reflex"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          zIndex: 20,
          pointerEvents: "none",
          mixBlendMode: "screen",
          opacity: 0.8
        }}
      />
    </section>
  );
});

export default MugEditor;