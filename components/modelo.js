import { useEffect, useRef, useState } from "react";
import interact from "interactjs";
import html2canvas from "html2canvas";

export default function ProfessionalSwissEditor() {
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const mockupAreaRef = useRef(null);
  
  const [view, setView] = useState("Mitte");
  const [activeTab, setActiveTab] = useState("upload");

  // ESTADO: Mantém tudo independente para cada lado
  const [designs, setDesigns] = useState({
    Links: { image: null, text: "", font: "'Inter', sans-serif", color: "#000000" },
    Mitte: { image: null, text: "", font: "'Inter', sans-serif", color: "#000000" },
    Rechts: { image: null, text: "", font: "'Inter', sans-serif", color: "#000000" }
  });

  const mugImages = {
    Links: "/caneca-lado-esquerdo.png",
    Mitte: "/caneca-mitte.png",
    Rechts: "/caneca.png" 
  };

  // INTERAÇÕES: Arrastar e Redimensionar
  useEffect(() => {
    const currentDesign = designs[view];
    if (currentDesign.image && imageRef.current) {
      interact(imageRef.current)
        .draggable({
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
        })
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          listeners: {
            move(event) {
              let target = event.target;
              let x = (parseFloat(target.getAttribute('data-x')) || 0);
              let y = (parseFloat(target.getAttribute('data-y')) || 0);
              target.style.width = event.rect.width + 'px';
              target.style.height = event.rect.height + 'px';
              x += event.deltaRect.left;
              y += event.deltaRect.top;
              target.style.transform = `translate(${x}px, ${y}px)`;
              target.setAttribute('data-x', x);
              target.setAttribute('data-y', y);
            }
          },
          modifiers: [
            interact.modifiers.aspectRatio({ ratio: 'preserve' }),
            interact.modifiers.restrictSize({ min: { width: 40, height: 40 } })
          ]
        });
    }
    
    if (currentDesign.text && textRef.current) {
      interact(textRef.current).draggable({
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
      });
    }

    return () => {
      if (imageRef.current) interact(imageRef.current).unset();
      if (textRef.current) interact(textRef.current).unset();
    };
  }, [view, designs]);

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateDesignField("image", url);
  };

  const updateDesignField = (field, value) => {
    setDesigns(prev => ({ ...prev, [view]: { ...prev[view], [field]: value } }));
  };

  const exportImage = async () => {
    if (!mockupAreaRef.current) return;
    const canvas = await html2canvas(mockupAreaRef.current, { useCORS: true, scale: 2 });
    const link = document.createElement("a");
    link.download = `mein-design-${view}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const tabButtonStyle = (isActive) => ({
    background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column",
    alignItems: "center", gap: "8px", color: isActive ? "#8b6f48" : "#ccc", transition: "0.3s",
    padding: "15px 0", width: "100%", borderLeft: isActive ? "3px solid #8b6f48" : "3px solid transparent"
  });

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4", fontFamily: 'Inter, sans-serif' }}>
      
      {/* LADO ESQUERDO: PREVIEW */}
      <div style={{ flex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 40, left: 40 }}>
          <h2 style={{ fontSize: "12px", fontWeight: "900", color: "#bbb", textTransform: "uppercase", letterSpacing: "2px" }}>Swiss Precision</h2>
          <p style={{ fontSize: "24px", fontWeight: "300", margin: 0 }}>Tasse Klassik <span style={{ fontWeight: "700" }}>Pro</span></p>
        </div>

        <div ref={mockupAreaRef} style={{ position: "relative", width: 450, height: 450, backgroundColor: "#fff", borderRadius: "12px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.05)" }}>
          <img src={mugImages[view]} style={{ width: "100%", height: "100%", objectFit: "contain", position: "absolute", zIndex: 1, pointerEvents: "none" }} />
          
          <div style={{ position: "absolute", top: "22%", left: "50%", width: "320px", height: "220px", zIndex: 2, transform: "translateX(-50%)", display: "flex", alignItems: "center", justifyContent: "center", mixBlendMode: "multiply", overflow: "hidden" }}>
            {designs[view].image && (
              <img key={`img-${view}`} ref={imageRef} src={designs[view].image} style={{ width: "150px", position: "absolute", cursor: "nwse-resize", touchAction: "none" }} />
            )}
            {designs[view].text && (
              <span ref={textRef} style={{ position: "absolute", color: designs[view].color, fontFamily: designs[view].font, fontWeight: "bold", fontSize: "24px", cursor: "move", whiteSpace: "nowrap" }}>
                {designs[view].text}
              </span>
            )}
          </div>
        </div>

        {/* SELETOR DE LADOS (ESTILO QUE VOCÊ GOSTA) */}
        <div style={{ marginTop: 40 }}>
          <ul style={{ display: "flex", gap: "20px", listStyle: "none", padding: 0 }}>
            {["Links", "Mitte", "Rechts"].map((v) => (
              <li key={v}>
                <button onClick={() => setView(v)} style={{ background: "none", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: view === v ? "#000" : "#bbb", borderBottom: view === v ? "2px solid #8b6f48" : "2px solid transparent", transition: "0.3s" }}>
                  {v}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* LADO DIREITO: EDITOR COMPLETO */}
      <div style={{ width: "450px", backgroundColor: "#fff", borderLeft: "1px solid #eee", display: "flex" }}>
        
        <div style={{ width: "85px", borderRight: "1px solid #eee", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "40px", gap: "10px" }}>
          <button onClick={() => setActiveTab("product")} style={tabButtonStyle(activeTab === "product")}><span>☕</span><span style={{fontSize: '9px', fontWeight: '800'}}>PRODUKT</span></button>
          <button onClick={() => setActiveTab("design")} style={tabButtonStyle(activeTab === "design")}><span>🎨</span><span style={{fontSize: '9px', fontWeight: '800'}}>DESIGN</span></button>
          <button onClick={() => setActiveTab("text")} style={tabButtonStyle(activeTab === "text")}><span>T</span><span style={{fontSize: '9px', fontWeight: '800'}}>TEXT</span></button>
          <button onClick={() => setActiveTab("upload")} style={tabButtonStyle(activeTab === "upload")}><span>📥</span><span style={{fontSize: '9px', fontWeight: '800'}}>UPLOAD</span></button>
        </div>

        <div style={{ flex: 1, padding: "40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ overflowY: "auto" }}>
            
            {activeTab === "design" && (
              <div>
                <h3 style={titleStyle}>Kreativ-Bereich ({view})</h3>
                <p style={subTitleStyle}>LAYOUTS / MASKEN</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                  <button style={layoutButtonStyle}>❤️ Herz</button>
                  <button style={layoutButtonStyle}>⬢ Hexagon</button>
                  <button style={layoutButtonStyle}>⬜ Quadrat</button>
                  <button style={layoutButtonStyle}>⭕ Kreis</button>
                </div>
                <p style={subTitleStyle}>ELEMENTE & ZEICHNUNGEN</p>
                <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px" }}>
                   <div style={elementPlaceholder}>🌸</div><div style={elementPlaceholder}>✨</div><div style={elementPlaceholder}>🏔️</div>
                </div>
                <p style={subTitleStyle}>FERTIGE SPRÜCHE</p>
                <button style={layoutButtonStyle}>"Alles Liebe"</button>
              </div>
            )}

            {activeTab === "upload" && (
              <div>
                <h3 style={titleStyle}>Design hochladen</h3>
                <label style={uploadBoxStyle}>
                  <span style={{fontSize: '30px', marginBottom: '10px'}}>📥</span>
                  <span style={{fontSize: '12px', fontWeight: '700'}}>BILD WÄHLEN</span>
                  <input type="file" accept="image/*" onChange={uploadImage} style={{ display: "none" }} />
                </label>
                <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fff5e6", borderRadius: "8px", border: "1px solid #ffe0b3" }}>
                  <p style={{ fontSize: "11px", fontWeight: "bold", marginBottom: "10px" }}>AI-WERKZEUG</p>
                  <button style={aiButtonStyle}>✨ Hintergrund entfernen</button>
                </div>
              </div>
            )}

            {activeTab === "text" && (
              <div>
                <h3 style={titleStyle}>Text für {view}</h3>
                <input type="text" value={designs[view].text} onChange={(e) => updateDesignField("text", e.target.value)} placeholder="Z.B. Sandra" style={inputStyle} />
                
                <h3 style={{...titleStyle, marginTop: "20px"}}>Schriftart</h3>
                <select value={designs[view].font} onChange={(e) => updateDesignField("font", e.target.value)} style={inputStyle}>
                  <option value="'Inter', sans-serif">Inter (Modern)</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                  <option value="'Playfair Display', serif">Playfair Display</option>
                  <option value="'Dancing Script', cursive">Dancing Script</option>
                  <option value="'Bebas Neue', cursive">Bebas Neue (Bold)</option>
                  <option value="'Pacifico', cursive">Pacifico (Retro)</option>
                  <option value="'Satisfy', cursive">Satisfy</option>
                  <option value="'Caveat', cursive">Caveat</option>
                  <option value="'Permanent Marker', cursive">Permanent Marker</option>
                  <option value="'Lobster', cursive">Lobster</option>
                </select>

                <h3 style={{...titleStyle, marginTop: "20px"}}>Farbe</h3>
                <input type="color" value={designs[view].color} onChange={(e) => updateDesignField("color", e.target.value)} style={{ width: "100%", height: "45px", border: "none", cursor: "pointer", borderRadius: '6px' }} />
              </div>
            )}
            
            {activeTab === "product" && (
              <div>
                <h3 style={titleStyle}>Produktdetails</h3>
                <p style={{fontSize: '14px', fontWeight: 'bold'}}>Tasse Klassik Pro - Weiss</p>
                <ul style={{fontSize: '12px', color: '#666', marginTop: '10px', lineHeight: '1.8'}}>
                  <li>Hochwertige Keramik</li>
                  <li>330ml Fassungsvermögen</li>
                  <li>Spülmaschinenfest</li>
                </ul>
                <h3 style={{...titleStyle, marginTop: '30px'}}>Galerie</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div style={gridPhotoPlaceholder}>Foto 1</div>
                  <div style={gridPhotoPlaceholder}>Foto 2</div>
                </div>
              </div>
            )}
          </div>

          <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <span style={{ fontSize: "12px", color: "#bbb", fontWeight: "700" }}>PREIS</span>
              <span style={{ fontSize: "32px", fontWeight: "300" }}>CHF 24.90</span>
            </div>
            <button onClick={exportImage} style={{ width: "100%", background: "#8b6f48", color: "#fff", border: "none", padding: "20px", borderRadius: "6px", fontWeight: "700", cursor: "pointer", textTransform: 'uppercase' }}>
              In den Warenkorb
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ESTILOS FINAIS
const titleStyle = { fontSize: "11px", fontWeight: "900", textTransform: "uppercase", color: "#bbb", marginBottom: "20px", letterSpacing: "1px" };
const subTitleStyle = { fontSize: '10px', fontWeight: 'bold', color: '#8b6f48', marginBottom: '10px' };
const inputStyle = { width: "100%", padding: "15px", border: "1px solid #eee", borderRadius: "6px", outline: "none", marginBottom: "10px" };
const layoutButtonStyle = { width: "100%", padding: "12px", border: "1px solid #eee", borderRadius: "4px", backgroundColor: "#fff", cursor: "pointer", fontSize: "11px", fontWeight: 'bold' };
const uploadBoxStyle = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #eee", borderRadius: "12px", height: "180px", cursor: "pointer", backgroundColor: "#fafafa" };
const aiButtonStyle = { width: "100%", padding: "12px", background: "#000", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" };
const gridPhotoPlaceholder = { width: "100%", height: "80px", backgroundColor: "#eee", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#999" };
const elementPlaceholder = { minWidth: "60px", height: "60px", border: '1px solid #eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', cursor: 'pointer', backgroundColor: '#fff' };