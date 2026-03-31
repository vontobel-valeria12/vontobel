import React from 'react';

const DraggableText = ({ data, view }) => {
  if (!data?.text) return null;

  return (
    <div
      className="draggable-text"
      data-key="text"
      data-x={data.textX || 0}
      data-y={data.textY || 0}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 10,
        color: data.color || "#000000",
        fontFamily: data.font || "'Inter', sans-serif",
        fontSize: (data.fontSize || 24) + "px",
        fontWeight: data.fontWeight || "bold",
        fontStyle: data.fontStyle || "normal",
        textAlign: data.textAlign || "center",
        whiteSpace: "pre-wrap",
        lineHeight: "1.2",
        WebkitTextStroke: `1.5px ${data.strokeColor || "#ffffff"}`,
        textShadow: `0 1px 3px rgba(0,0,0,0.1)`,
        transform: `translate(${data.textX || 0}px, ${data.textY || 0}px)`,
        cursor: "move",
        touchAction: "none",
        pointerEvents: "auto", // Garante que o clique funcione
      }}
    >
      {data.text}
    </div>
  );
};

export default DraggableText;