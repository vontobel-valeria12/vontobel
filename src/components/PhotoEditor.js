import { useEffect, useRef, useState } from "react";
import interact from "interactjs";
import html2canvas from "html2canvas";

// --- DATENBANKEN ---
const DESIGN_DATABASE = [
  { id: 1, name: "Löwe", url: "https://cdn-icons-png.flaticon.com/512/616/616412.png", theme: "Tiere" },
  { id: 2, name: "Fußball", url: "https://cdn-icons-png.flaticon.com/512/53/53283.png", theme: "Sport" },
  { id: 3, name: "Herz", url: "https://cdn-icons-png.flaticon.com/512/210/210543.png", theme: "liben" },
  { id: 4, name: "Schweiz", url: "https://cdn-icons-png.flaticon.com/512/197/197540.png", theme: "Flagger" },
];

const THEMES = ["Alle", "Tiere", "Sport", "liben", "Flagger"];

export default function ProfessionalSwissEditor() {
  const mockupAreaRef = useRef(null);
  const [view, setView] = useState("Mitte");
  const [activeTab, setActiveTab] = useState("design");
  const [selectedTheme, setSelectedTheme] = useState("Alle");

  const [designs, setDesigns] = useState({
    Links: { images: [], text: "", font: "'Inter', sans-serif", color: "#000000" },
    Mitte: { images: [], text: "", font: "'Inter', sans-serif", color: "#000000" },
    Rechts: { images: [], text: "", font: "'Inter', sans-serif", color: "#000000" }
  });

  const mugImages = { Links: "/caneca-lado-esquerdo.png", Mitte: "/caneca-mitte.png", Rechts: "/caneca.png" };

  // --- LOGIK ---
  const addImage = (url, customProps = {}) => {
    const newImage = { 
      id: `img-${Date.now()}-${Math.random()}`, 
      url, 
      width: customProps.width || 80, 
      x: customProps.x || 20, 
      y: customProps.y || 20 
    };
    setDesigns(prev => ({
      ...prev,
      [view]: { ...prev[view], images: [...prev[view].images, newImage] }
    }));
  };

  const applyLayout = (count) => {
    const placeholder = "https://via.placeholder.com/150?text=Foto+hier";
    let templates = [];
    if (count === 1) templates = [{ x: 90, y: 40, width: 140 }];
    if (count === 2) templates = [{ x: 30, y: 60, width: 110 }, { x: 180, y: 60, width: 110 }];
    if (count === 3) templates = [{ x: 20, y: 70, width: 85 }, { x: 115, y: 70, width: 85 }, { x: 215, y: 70, width: 85 }];
    if (count === 4) templates = [{ x: 40, y: 20, width: 90 }, { x: 190, y: 20, width: 90 }, { x: 40, y: 120, width: 90 }, { x: 190, y: 120, width: 90 }];

    // Bestehende Bilder löschen und Layout setzen
    const newImages = templates.map(t => ({ id: `lay-${Date.now()}-${Math.random()}`, url: placeholder, ...t }));
    setDesigns(prev => ({ ...prev, [view]: { ...prev[view], images: newImages } }));
  };

  useEffect(() => {
    const selector = '.draggable-img';
    interact(selector).draggable({
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      }
    }).resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move(event) {
          let target = event.target;
          let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.deltaRect.left;
          let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.deltaRect.top;
          target.style.width = event.rect.width + 'px';
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      }
    });
    return () => interact(selector).unset();
  }, [view, designs[view].images]);

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f9f9f9", fontFamily: 'Inter, sans-serif' }}>
      
      {/* CANVAS BEREICH */}
      <div style={{ flex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div ref={mockupAreaRef} style={canvasWrapperStyle}>
          <img src={mugImages[view]} style={mugImageStyle} />
          <div style={designLayerStyle}>
            {designs[view].images.map((img) => (
              <div key={img.id} className="draggable-img" data-id={img.id} data-x={img.x} data-y={img.y} style={{ position: "absolute", width: img.width, transform: `translate(${img.x}px, ${img.y}px)`, touchAction: "none" }}>
                <img src={img.url} style={{ width: "100%", display: "block", borderRadius: "4px" }} />
                <button onClick={() => setDesigns({...designs, [view]: {...designs[view], images: designs[view].images.filter(i => i.id !== img.id)}})} style={removeButtonStyle}>✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* VIEW SWITCHER */}
        <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
          {["Links", "Mitte", "Rechts"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ ...viewTabStyle, color: view === v ? "#8b6f48" : "#ccc", borderBottom: view === v ? "2px solid #8b6f48" : "none" }}>{v}</button>
          ))}
        </div>
      </div>

      {/* SIDEBAR EDITOR */}
      <div style={sidebarStyle}>
        {/* MAIN TABS */}
        <div style={tabNavStyle}>
          <button onClick={() => setActiveTab("design")} style={{ ...tabBtnStyle, borderBottom: activeTab === "design" ? "3px solid #8b6f48" : "none" }}>DESIGN</button>
          <button onClick={() => setActiveTab("text")} style={{ ...tabBtnStyle, borderBottom: activeTab === "text" ? "3px solid #8b6f48" : "none" }}>TEXT</button>
        </div>

        <div style={{ flex: 1, padding: "25px", overflowY: "auto" }}>
          {activeTab === "design" && (
            <>
              {/* DIV 1: LAYOUTS (RASTER) */}
              <div style={{ marginBottom: "40px" }}>
                <h3 style={sectionTitleStyle}>Layout wählen (Anzahl Fotos)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px" }}>
                  {[1, 2, 3, 4].map(num => (
                    <button key={num} onClick={() => applyLayout(num)} style={layoutSquareStyle}>
                      <div style={layoutIconGrid(num)}></div>
                      <span style={{ fontSize: "10px", marginTop: "5px" }}>{num} Foto{num > 1 ? 's' : ''}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* DIV 2: MOTIVE & STICKER */}
              <div>
                <h3 style={sectionTitleStyle}>Motive & Sticker hinzufügen</h3>
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", marginBottom: "15px", paddingBottom: "5px" }}>
                  {THEMES.map(t => (
                    <button key={t} onClick={() => setSelectedTheme(t)} style={{ ...themeBadgeStyle, backgroundColor: selectedTheme === t ? "#8b6f48" : "#eee", color: selectedTheme === t ? "#fff" : "#666" }}>{t}</button>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  {DESIGN_DATABASE.filter(d => selectedTheme === "Alle" || d.theme === selectedTheme).map(item => (
                    <div key={item.id} onClick={() => addImage(item.url)} style={stickerBoxStyle}>
                      <img src={item.url} style={{ width: "65%" }} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "text" && (
            <div>
              <h3 style={sectionTitleStyle}>Text hinzufügen</h3>
              <input type="text" placeholder="Dein Text..." style={inputStyle} onChange={(e) => setDesigns({...designs, [view]: {...designs[view], text: e.target.value}})} />
            </div>
          )}
        </div>

        <div style={footerStyle}>
          <button style={buyButtonStyle}>IN DEN WARENKORB - CHF 24.90</button>
        </div>
      </div>
    </div>
  );
}

// --- STYLES ---
const canvasWrapperStyle = { position: "relative", width: 450, height: 450, backgroundColor: "#fff", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)" };
const mugImageStyle = { width: "100%", height: "100%", objectFit: "contain", position: "absolute", zIndex: 1, pointerEvents: "none" };
const designLayerStyle = { position: "absolute", top: "22%", left: "50%", width: "320px", height: "220px", zIndex: 2, transform: "translateX(-50%)", mixBlendMode: "multiply" };
const sidebarStyle = { width: "420px", backgroundColor: "#fff", borderLeft: "1px solid #eee", display: "flex", flexDirection: "column" };
const tabNavStyle = { display: "flex", borderBottom: "1px solid #eee", backgroundColor: "#fff" };
const tabBtnStyle = { flex: 1, padding: "20px", border: "none", background: "none", fontWeight: "800", fontSize: "12px", cursor: "pointer", letterSpacing: "1px" };
const sectionTitleStyle = { fontSize: "11px", fontWeight: "900", color: "#bbb", textTransform: "uppercase", marginBottom: "15px" };
const layoutSquareStyle = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px", border: "1px solid #eee", borderRadius: "8px", cursor: "pointer", background: "#fff" };
const stickerBoxStyle = { height: "100px", border: "1px solid #f0f0f0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "0.2s" };
const themeBadgeStyle = { padding: "6px 14px", borderRadius: "15px", border: "none", fontSize: "10px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" };
const footerStyle = { padding: "25px", borderTop: "1px solid #eee" };
const buyButtonStyle = { width: "100%", background: "#8b6f48", color: "#fff", border: "none", padding: "20px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" };
const removeButtonStyle = { position: "absolute", top: "-10px", right: "-10px", background: "#ff4b2b", color: "#fff", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", fontSize: "10px", zIndex: 10 };
const inputStyle = { width: "100%", padding: "15px", border: "1px solid #eee", borderRadius: "8px" };
const viewTabStyle = { background: "none", border: "none", padding: "10px 15px", cursor: "pointer", fontWeight: "800", fontSize: "12px" };

// Hilfsfunktion für kleine Layout-Icons
const layoutIconGrid = (num) => ({
  width: "30px", height: "20px", border: "1px solid #ddd", display: "grid",
  gridTemplateColumns: num === 1 ? "1fr" : (num === 2 ? "1fr 1fr" : (num === 3 ? "1fr 1fr 1fr" : "1fr 1fr")),
  gap: "1px", background: "#eee"
});