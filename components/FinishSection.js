import React, { useState } from "react";
import { Check } from "lucide-react";

const BACKGROUNDS = [
  { id: "white", color: "#FFFFFF", texture: "none" },
  { id: "marble", color: "#f8f8f8", texture: 'url("https://www.transparenttextures.com/patterns/white-marble.png")' },
  { id: "carbon", color: "#1a1a1a", texture: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' },
  { id: "sand", color: "#d6c4a8", texture: 'url("https://www.transparenttextures.com/patterns/sandpaper.png")' }
];

const FinishSection = ({ onBgChange }) => {
  const [selected, setSelected] = useState("white");

  return (
    <div style={{ display: "flex", gap: 12, padding: "4px 0" }}>
      {BACKGROUNDS.map((b) => (
        <button
          key={b.id}
          onClick={() => { setSelected(b.id); onBgChange?.(b.color, b.texture); }}
          style={{
            all: "unset",
            cursor: "pointer",
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: b.color,
            backgroundImage: b.texture,
            backgroundSize: "cover",
            border: selected === b.id ? `2px solid #8b6f48` : "1px solid #DDD",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "0.2s transform",
            transform: selected === b.id ? "scale(1.1)" : "scale(1)"
          }}
        >
          {selected === b.id && <Check size={16} color={b.id === "white" ? "#8b6f48" : "white"} strokeWidth={3} />}
        </button>
      ))}
    </div>
  );
};

export default FinishSection;