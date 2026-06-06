import { useEffect, useRef, useState } from "react";
import interact from "interactjs";
import html2canvas from "html2canvas";
import DesignSelector from './DesignSelector';
import MugEditor from './MugEditor';
import LayoutSection from "./LayoutSection";



const photoServiceBase = 10.00;

export default function ProfessionalSwissEditor() {
  const mockupAreaRef = useRef(null);

  // --- STATES ---
  const [mask, setMask] = useState('inset(0%)');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [view, setView] = useState("Rechts");
  const [activeTab, setActiveTab] = useState("upload");
  const [editorMode, setEditorMode] = useState("STANDARD");
  const [selectedLayout, setSelectedLayout] = useState("1-full");
  const [uploadedImg, setUploadedImg] = useState(null);
  const fileInputRef = useRef(null);
  const userImg = "/uploads/userFoto.jpg"; 
  const asset = { x: 0, y: 0, scale: 1 };  
  const [selectedLayoutId, setSelectedLayoutId] = useState("standard");
  const [userText, setUserText] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [userImage, setUserImage] = useState(null);
  const fontsList = [
  // Modern & Clean
  { name: 'Inter', value: "'Inter', sans-serif" },
  { name: 'Roboto', value: "'Roboto', sans-serif" },
  { name: 'Montserrat', value: "'Montserrat', sans-serif" },
  { name: 'Open Sans', value: "'Open Sans', sans-serif" },
  { name: 'Poppins', value: "'Poppins', sans-serif" },
  { name: 'Quicksand', value: "'Quicksand', sans-serif" },
  // Elegant & Classic
  { name: 'Playfair Display', value: "'Playfair Display', serif" },
  { name: 'Lora', value: "'Lora', serif" },
  { name: 'Cinzel', value: "'Cinzel', serif" },
  { name: 'Baskerville', value: "'Baskervville', serif" },
  { name: 'Bodoni', value: "'Bodoni Moda', serif" },
  // Handschrift & Script
  { name: 'Dancing Script', value: "'Dancing Script', cursive" },
  { name: 'Pacifico', value: "'Pacifico', cursive" },
  { name: 'Satisfy', value: "'Satisfy', cursive" },
  { name: 'Caveat', value: "'Caveat', cursive" },
  { name: 'Great Vibes', value: "'Great Vibes', cursive" },
  { name: 'Sacramento', value: "'Sacramento', cursive" },
  // Bold & Impact
  { name: 'Bebas Neue', value: "'Bebas Neue', cursive" },
  { name: 'Anton', value: "'Anton', sans-serif" },
  { name: 'Oswald', value: "'Oswald', sans-serif" },
  { name: 'Lobster', value: "'Lobster', cursive" },
  { name: 'Righteous', value: "'Righteous', cursive" },
  { name: 'Fredoka One', value: "'Fredoka One', cursive" }
];

   const [designs, setDesigns] = useState({
    Links: { images: {}, text: "", font: "'Inter', sans-serif", color: "#000000" },
    Rechts: { images: {}, text: "", font: "'Inter', sans-serif", color: "#000000" },
    Panorama: { images: {}, text: "", font: "'Inter', sans-serif", color: "#000000" }
  });

  const [selectedMug, setSelectedMug] = useState({
    name: "Caneca Branca 11oz",
    price: 6.00 
  });

  const mugImages = {
    Links: "/caneca-lado-esquerdo.png",
    Rechts: "/caneca.png",
    Panorama: "/caneca-panorama.png" 
  };
  const PRODUCT_ENGINE_CONFIG = {
  viewports: {
    Panorama: {
      base: "/caminho/para/sua/caneca-base.png",
      slots: [
        { id: "main_upload", zIndex: 10, mask: "/caminho/para/sua/mascara.png" }
      ],
      overlays: []
    }
  }
};
const zoomBtn = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  border: "none",
  background: "#fff",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: "bold"
};
const [history, setHistory] = useState([]);
const [historyStep, setHistoryStep] = useState(-1);

const saveToHistory = (newState) => {
  // Usamos uma função para garantir que pegamos o estado anterior correto
  setHistory(prev => {
    const newHistory = prev.slice(0, historyStep + 1);
    return [...newHistory, JSON.parse(JSON.stringify(newState))];
  });
  setHistoryStep(prev => prev + 1);
};

// Função para Voltar (Undo)
const undo = () => {
  if (historyStep > 0) {
    const prevStep = historyStep - 1;
    setDesigns(history[prevStep]);
    setHistoryStep(prevStep);
  }
};
const addTextElement = () => {
  const id = `text_${Date.now()}`;
  setDesigns(prev => ({
    ...prev,
    [view]: {
      ...prev[view],
      texts: {
        ...prev[view].texts,
        [id]: { content: "Novo Texto", x: 0, y: 0, font: "Inter", fontSize: 24 }
      }
    }
  }));
};
const triggerUpload = (slotId) => {
  // Isso simula o clique no input de arquivo que está escondido
  document.getElementById(`input-${slotId}`).click();
};
const zoomElement = (direction) => {
  const el = document.querySelector('.draggable-item:last-child');
  if (!el) return;

  let scale = parseFloat(el.getAttribute('data-scale')) || 1;
  let x = parseFloat(el.getAttribute('data-x')) || 0;
  let y = parseFloat(el.getAttribute('data-y')) || 0;

  const step = 0.1;
  let newScale = direction === 'in' ? scale + step : scale - step;

  newScale = Math.max(0.3, Math.min(newScale, 4));

  el.style.transform = `translate(${x}px, ${y}px) scale(${newScale})`;
  el.setAttribute('data-scale', newScale);
};

  // --- HANDLERS ---
  const handleUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    
    // Opcional: Atualiza o estado global se você ainda o usar
    setUploadedImg(url);

    setDesigns(prev => ({
      ...prev,
      [view]: {
        ...prev[view],
        images: {
          ...prev[view].images,
          // Usamos 'userUpload' como chave única. 
          // Se o cliente subir outra, ela substitui a anterior neste slot.
          userUpload: { 
            img: url, 
            label: "Upload",
            price: 0, 
            type: 'upload',
            // Coordenadas iniciais para o interactjs não "pular" no primeiro clique
            x: 0, 
            y: 0, 
            // Tamanho inicial sugerido para caber na área visível da caneca
            width: "180px", 
            height: "180px"
          }
        }
      }
    }));
    
    // Limpa o input para permitir subir a mesma imagem novamente se for deletada
    e.target.value = null;
  }
};

  const handleDesignSelection = (newDesign) => {
    setDesigns(prev => {
      const currentImages = { ...prev[view].images };
      const freeDesignKey = "design_gratis";
      const premiumId = `premium_${Date.now()}`;

      if (newDesign.price > 0) {
        currentImages[premiumId] = { ...newDesign, type: 'premium', x: 0, y: 0, width: "120px", height: "120px" };
      } else {
        currentImages[freeDesignKey] = { ...newDesign, type: 'gratis', x: 0, y: 0, width: "150px", height: "150px" };
      }
      

      return { ...prev, [view]: { ...prev[view], images: currentImages } };
    });
  };

  const updateDesignField = (field, value) => {
    setDesigns(prev => ({ ...prev, [view]: { ...prev[view], [field]: value } }));
  };

  const calculateTotalPrice = () => {
    let total = photoServiceBase + selectedMug.price;
    Object.values(designs).forEach(side => {
      Object.values(side.images).forEach(img => { if (img.price) total += img.price; });
    });
    return total.toFixed(2);
  };

  const removeImage = (key) => {
    setDesigns(prev => {
      const updatedImages = { ...prev[view].images };
      delete updatedImages[key];
      return { ...prev, [view]: { ...prev[view], images: updatedImages } };
    });
  };

  const updateImageCoords = (key, coords) => {
    setDesigns(prev => ({
      ...prev,
      [view]: {
        ...prev[view],
        images: { ...prev[view].images, [key]: { ...prev[view].images[key], ...coords } }
      }
    }));
  };
  // Atualiza coordenadas de um TEXTO específico
const updateTextCoords = (id, coords) => {
  setDesigns(prev => ({
    ...prev,
    [view]: {
      ...prev[view],
      texts: { 
        ...prev[view].texts, 
        [id]: { ...prev[view].texts[id], ...coords } 
      }
    }
  }));
};

useEffect(() => {
  const selector = '.draggable-item, .draggable-text';

  const instance = interact(selector)
    .draggable({
      listeners: {
        move(event) {
          const target = event.target;

          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          const scale = parseFloat(target.getAttribute('data-scale')) || 1;

          target.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        },
        end(event) {
          syncState(event.target);
        }
      }
    })
    .gesturable({
      listeners: {
        start(event) {
          const target = event.target;
          target.setAttribute(
            'data-start-scale',
            target.getAttribute('data-scale') || 1
          );
        },
        move(event) {
          const target = event.target;

          const x = parseFloat(target.getAttribute('data-x')) || 0;
          const y = parseFloat(target.getAttribute('data-y')) || 0;

          const startScale =
            parseFloat(target.getAttribute('data-start-scale')) || 1;

          let newScale = startScale * event.scale;

          // LIMITES
          newScale = Math.max(0.3, Math.min(newScale, 4));

          target.style.transform = `translate(${x}px, ${y}px) scale(${newScale})`;
          target.setAttribute('data-scale', newScale);
        },
        end(event) {
          syncState(event.target);
        }
      }
    });

  const syncState = (target) => {
    const key = target.getAttribute('data-key');
    const x = parseFloat(target.getAttribute('data-x')) || 0;
    const y = parseFloat(target.getAttribute('data-y')) || 0;
    const scale = parseFloat(target.getAttribute('data-scale')) || 1;

    setDesigns(prev => {
      const newState = { ...prev };

      if (target.classList.contains('draggable-text')) {
        newState[view].textX = x;
        newState[view].textY = y;
        newState[view].textScale = scale;
      } else {
        newState[view].images[key] = {
          ...newState[view].images[key],
          x,
          y,
          scale
        };
      }

      return newState;
    });
  };

  return () => instance.unset();
}, [view]);

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
useEffect(() => {
  const handleWheel = (e) => {
    const target = e.target.closest('.draggable-item, .draggable-text');
    if (!target) return;

    e.preventDefault();

    const rect = target.getBoundingClientRect();

    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    let scale = parseFloat(target.getAttribute('data-scale')) || 1;
    let x = parseFloat(target.getAttribute('data-x')) || 0;
    let y = parseFloat(target.getAttribute('data-y')) || 0;

    const zoomFactor = -e.deltaY * 0.001;
    let newScale = scale + zoomFactor;

    // LIMITES
    newScale = Math.max(0.3, Math.min(newScale, 4));

    // ZOOM CENTRADO NO MOUSE
    const scaleRatio = newScale / scale;

    x -= offsetX * (scaleRatio - 1);
    y -= offsetY * (scaleRatio - 1);

    target.style.transform = `translate(${x}px, ${y}px) scale(${newScale})`;

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    target.setAttribute('data-scale', newScale);

  };

  document.addEventListener('wheel', handleWheel, { passive: false });

  return () => {
    document.removeEventListener('wheel', handleWheel);
  };
}, []);
  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f4f4f4", fontFamily: 'Inter, sans-serif' }}>
      
      {/* MOCKUP AREA */}
      <div style={{ flex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 40, left: 40 }}>
          <h2 style={{ fontSize: "12px", fontWeight: "900", color: "#bbb", textTransform: "uppercase", letterSpacing: "2px" }}>Swiss Precision</h2>
          <p style={{ fontSize: "24px", fontWeight: "300", margin: 0 }}>Tasse Klassik <span style={{ fontWeight: "700" }}>Pro</span></p>
        </div>

        <div ref={mockupAreaRef} style={{ position: "relative", width: 450, height: 450, backgroundColor: bgColor, borderRadius: "12px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.05)" }}>
          <img src={mugImages[view]} alt="Mug" style={{ width: "100%", height: "100%", objectFit: "contain", position: "absolute", zIndex: 1, pointerEvents: "none" }} />
          
            <div style={{ 
            position: "absolute", 
            top: "12%", 
            left: view === "Links" ? "66%" : view === "Rechts" ? "35%" : "50%", 
            width: view === "Panorama" ? "420px" : "250px", 
            height: "330px", 
            zIndex: 2, 
            transform: "translateX(-50%)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            mixBlendMode: "multiply", 
            overflow: "hidden",
            clipPath: mask 
          }}>
            {/* RENDERIZAÇÃO DAS IMAGENS */}
            {Object.entries(designs[view].images).map(([key, data]) => (
              <div 
                key={key}
                className="draggable-item" 
                data-key={key} 
                data-x={data.x || 0} 
                data-y={data.y || 0}
                data-scale={data.scale || 1} 
                style={{ 
                  position: "absolute", 
                  width: data.width || "150px", 
                  height: data.height || "150px", 
                  transform: `translate(${data.x || 0}px, ${data.y || 0}px) scale(${data.scale || 1})`,
                  cursor: "move", 
                  touchAction: "none" 
                }}
              >
                <button 
                  onClick={(e) => { e.stopPropagation(); removeImage(key); }} 
                  style={{ position: "absolute", top: -10, right: -10, zIndex: 10, color: "#0c0c0c", background: "white", border: "1px solid #ccc", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer" }}
                >✕</button>
                {data.img ? (
                  <img src={data.img} alt="Design" style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                     {data.icon && <data.icon size="80%" color="#8b6f48" />}
                  </div>
                )}
              </div>
            ))}

            {/* RENDERIZAÇÃO DO TEXTO */}
            {designs[view]?.text && (
              <span 
                className="draggable-text"
                data-x={designs[view].textX || 0} 
                data-y={designs[view].textY || 0}
                data-scale={designs[view].textScale || 1}
                style={{ 
                  position: "absolute", 
                  color: designs[view].color, 
                  fontFamily: designs[view].font,
                  fontSize: `${designs[view].fontSize}px`,
                  fontWeight: designs[view].fontWeight || "bold",
                  fontStyle: designs[view].fontStyle || "normal",
                  whiteSpace: "pre-wrap",
                  WebkitTextStroke: `1.5px ${designs[view].strokeColor || "#ffffff"}`, 
                  textShadow: `0 1px 3px rgba(0,0,0,0.1)`,
                  transform: `translate(${designs[view].textX || 0}px, ${designs[view].textY || 0}px) scale(${designs[view].textScale || 1})`,
                  cursor: "move", 
                  touchAction: "none",
                  zIndex: 10
                }}
              >
                {designs[view].text}
              </span>
            )}
          </div> {/* Fecha a zona de impressão */}
        </div> {/* Fecha o mockupAreaRef */}

        {/* SELETOR DE VISTA */}
        <div style={{ marginTop: 40 }}>
          {editorMode === "STANDARD" ? (
            <ul style={{ display: "flex", gap: "20px", listStyle: "none", padding: 0 }}>
              {["Links", "Rechts"].map((v) => (
                <li key={v}>
                  <button onClick={() => setView(v)} style={{ background: "none", border: "none", padding: "10px 20px", cursor: "pointer", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: view === v ? "#000" : "#bbb", borderBottom: view === v ? "2px solid #8b6f48" : "2px solid transparent", transition: "0.3s" }}>
                    {v}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <span style={{ fontSize: "12px", fontWeight: "900", color: "#8b6f48", letterSpacing: "1px" }}>PANORAMA-MODUS AKTIV</span>
          )}
        </div>
      </div>

    
      {/* CONTROL PANEL */}
      <div style={{ width: "450px", backgroundColor: "#fff", borderLeft: "1px solid #eee", display: "flex" }}>
        <div style={{ width: "85px", borderRight: "1px solid #eee", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "40px", gap: "10px" }}>
          <button onClick={() => setActiveTab("product")} style={tabButtonStyle(activeTab === "product")}><span>☕</span><span style={{fontSize: '9px', fontWeight: '800'}}>PRODUKT</span></button>
          <button onClick={() => setActiveTab("design")} style={tabButtonStyle(activeTab === "design")}><span>🎨</span><span style={{fontSize: '9px', fontWeight: '800'}}>DESIGN</span></button>
          <button onClick={() => setActiveTab("text")} style={tabButtonStyle(activeTab === "text")}><span>T</span><span style={{fontSize: '9px', fontWeight: '800'}}>TEXT</span></button>
          <button onClick={() => setActiveTab("upload")} style={tabButtonStyle(activeTab === "upload")}><span>📥</span><span style={{fontSize: '9px', fontWeight: '800'}}>UPLOAD</span></button>
          <button onClick={() => setActiveTab("layout")} style={tabButtonStyle(activeTab === "layout")}><span>🖼️</span><span style={{fontSize: '9px', fontWeight: '800'}}>LAYOUT</span></button>
        </div>

        <div style={{ flex: 1, padding: "40px", display: "flex", flexDirection: "column", justifyContent: "space-between", overflowY: "auto" }}>
      <div>
  {activeTab === "layout" && (
  <div>
    <h3 style={titleStyle}>Layout wählen</h3>
    <LayoutSection onSelectLayout={(id) => {
      setSelectedLayout(id);
      
      if (id === 'panorama') {
        setEditorMode("PANORAMA");
        setView("Panorama");
      } else {
        setEditorMode("STANDARD");
        if (view === "Panorama") setView("Rechts");
      }

      // Aciona o seletor de arquivos
      fileInputRef.current?.click();
    }} />
    
    <input 
      type="file" 
      ref={fileInputRef}
      onChange={handleUpload} 
      style={{ display: "none" }} 
      accept="image/*"
    />

  
    <MugEditor
      layoutId={selectedLayout} 
      userImg={designs[view].images.userUpload?.img} 
      asset={designs[view].images.userUpload}         
    />
  </div>
)}
            {activeTab === "design" && (
              <div>
                <h3 style={titleStyle}>Kreativ-Bereich ({view})</h3>
                <DesignSelector onSelect={handleDesignSelection} />
              </div>
            )}

            {activeTab === "upload" && (
              <div>
                <h3 style={titleStyle}>Design hochladen</h3>
                <label style={uploadBoxStyle}>
                  <span style={{fontSize: '30px', marginBottom: '10px'}}>📥</span>
                  <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
                  <span style={{fontSize: '12px', fontWeight: '700'}}>BILD WÄHLEN</span>
                </label>
                <input id="hidden-upload-input" type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
              </div>
            )}

          {activeTab === "text" && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.3s' }}>
    
    {/* Campo de Digitação */}
   {/* Campo de Digitação com Suporte a Quebra de Linha */}
<div>
  <h3 style={titleStyle}>Textinhalt</h3>
  <div style={{ position: 'relative' }}>
    <textarea 
      value={designs[view]?.text || ""} 
      onChange={(e) => updateDesignField("text", e.target.value)} 
      placeholder="Dein Text hier...&#10;" 
      style={{ 
        ...inputStyle, 
        height: '100px',    // Aumentamos a altura para ver as linhas
        resize: 'none', 
        whiteSpace: 'pre-wrap',
        paddingRight: '40px',
        lineHeight: '1.4'
      }} 
    />
    <span style={{ position: 'absolute', right: '15px', top: '15px', opacity: 0.3 }}>✎</span>
  </div>
</div>

    {/* Typography & Color Grid */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 65px', gap: '12px' }}>
      <div>
  <h3 style={titleStyle}>Schriftart</h3>
  <select 
    value={designs[view]?.font || "'Inter', sans-serif"}
    onChange={(e) => updateDesignField("font", e.target.value)}
    style={{ ...inputStyle, cursor: 'pointer', fontWeight: '500' }}
  >
    {/* --- MODERN & SANS --- */}
    <optgroup label="Modern & Clean">
      <option value="'Inter', sans-serif">Inter</option>
      <option value="'Roboto', sans-serif">Roboto</option>
      <option value="'Montserrat', sans-serif">Montserrat</option>
      <option value="'Open Sans', sans-serif">Open Sans</option>
      <option value="'Poppins', sans-serif">Poppins</option>
      <option value="'Quicksand', sans-serif">Quicksand (Round)</option>
    </optgroup>

    {/* --- ELEGANT & SERIF --- */}
    <optgroup label="Elegant & Classic">
      <option value="'Playfair Display', serif">Playfair Display</option>
      <option value="'Lora', serif">Lora</option>
      <option value="'Cinzel', serif">Cinzel (Royal)</option>
      <option value="'Baskervville', serif">Baskerville</option>
      <option value="'Bodoni Moda', serif">Bodoni</option>
    </optgroup>

    {/* --- HANDWRITTEN & SCRIPT --- */}
    <optgroup label="Handschrift & Script">
      <option value="'Dancing Script', cursive">Dancing Script</option>
      <option value="'Pacifico', cursive">Pacifico (Retro)</option>
      <option value="'Satisfy', cursive">Satisfy</option>
      <option value="'Caveat', cursive">Caveat</option>
      <option value="'Great Vibes', cursive">Great Vibes</option>
      <option value="'Sacramento', cursive">Sacramento (Thin)</option>
    </optgroup>

    {/* --- BOLD & DISPLAY --- */}
    <optgroup label="Bold & Impact">
      <option value="'Bebas Neue', cursive">Bebas Neue</option>
      <option value="'Anton', sans-serif">Anton</option>
      <option value="'Oswald', sans-serif">Oswald</option>
      <option value="'Lobster', cursive">Lobster</option>
      <option value="'Righteous', cursive">Righteous</option>
      <option value="'Fredoka One', cursive">Fredoka One</option>
    </optgroup>
  </select>
</div>
      <div>
        <h3 style={titleStyle}>Farbe</h3>
        <div style={{ 
          position: 'relative', 
          height: '48px', 
          borderRadius: '8px', 
          border: '2px solid #eee',
          overflow: 'hidden'
        }}>
          <input 
            type="color" 
            value={designs[view]?.color || "#000000"} 
            onChange={(e) => updateDesignField("color", e.target.value)} 
            style={{ 
              position: 'absolute', scale: '2', top: 0, left: 0, 
              width: '100%', height: '100%', cursor: 'pointer', border: 'none' 
            }} 
          />
        </div>
      </div>
    </div>

    {/* Toolbar de Estilo e Contorno (Estilo Canva) */}
<div>
  <h3 style={titleStyle}>Textstyling & Kontur (Contorno)</h3>
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    
    {/* Botões de Estilo Existentes */}
    <div style={{ display: 'flex', backgroundColor: '#f9f9f9', padding: '2px', borderRadius: '8px', border: '1px solid #eee' }}>
      <button onClick={() => updateDesignField("fontWeight", designs[view]?.fontWeight === 'bold' ? 'normal' : 'bold')}
              style={miniButtonStyle(designs[view]?.fontWeight === 'bold')}>B</button>
      <button onClick={() => updateDesignField("fontStyle", designs[view]?.fontStyle === 'italic' ? 'normal' : 'italic')}
              style={miniButtonStyle(designs[view]?.fontStyle === 'italic')}>I</button>
    </div>

    {/* NOVO: Seletor de Cor do Contorno */}
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f9f9f9', padding: '5px 10px', borderRadius: '8px', border: '1px solid #eee' }}>
      <span style={{ fontSize: '11px', color: '#666', fontWeight: 'bold' }}>Kontur</span>
      <input 
        type="color" 
        value={designs[view]?.strokeColor || "#000000"} 
        onChange={(e) => updateDesignField("strokeColor", e.target.value)} 
        style={{ width: "35px", height: "35px", border: "1px solid #ddd", cursor: "pointer", borderRadius: '4px', padding: '1px' }} 
      />
    </div>
  </div>
</div>
        

    {/* Slider de Tamanho com Badge */}
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={titleStyle}>Grösse</h3>
        <span style={{ 
          backgroundColor: '#8b6f48', color: 'white', padding: '2px 8px', 
          borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' 
        }}>
          {designs[view]?.fontSize || 24}px
        </span>
      </div>
      <input 
        type="range" min="10" max="100" 
        value={designs[view]?.fontSize || 24} 
        onChange={(e) => updateDesignField("fontSize", parseInt(e.target.value))}
        style={{ width: '100%', accentColor: '#8b6f48', height: '6px', borderRadius: '5px', cursor: 'pointer' }}
      />
    </div>
  </div>
)}

            {activeTab === "product" && (
              <div>
                <h3 style={titleStyle}>Produktdetails</h3>
                <p style={{fontSize: '14px', fontWeight: 'bold'}}>Tasse Klassik Pro - Weiss</p>
                <ul style={{fontSize: '12px', color: '#666', marginTop: '10px', lineHeight: '1.8'}}>
                  <li>Hochwertige Keramik</li>
                  <li>330ml Fassungsvermögen</li>
                </ul>
              </div>
            )}
          </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <span style={{ fontSize: "12px", color: "#bbb", fontWeight: "700" }}>GESAMTPREIS</span>
              <span style={{ fontSize: "32px", fontWeight: "300" }}>CHF {calculateTotalPrice()}</span>
            </div>
            <button onClick={exportImage} style={{ width: "100%", background: "#8b6f48", color: "#fff", border: "none", padding: "20px", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
              IN DEN WARENKORB
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
const titleStyle = { fontSize: "11px", fontWeight: "900", textTransform: "uppercase", color: "#bbb", marginBottom: "20px", letterSpacing: "1px" };
const inputStyle = { width: "100%", padding: "15px", border: "1px solid #eee", borderRadius: "6px", outline: "none", marginBottom: "10px" };
const uploadBoxStyle = { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed #eee", borderRadius: "12px", height: "180px", cursor: "pointer", backgroundColor: "#fafafa" };
const miniButtonStyle = (isActive) => ({
  flex: 1,
  height: '36px',
  backgroundColor: isActive ? '#fff' : 'transparent',
  color: isActive ? '#8b6f48' : '#666',
  border: isActive ? '1px solid #8b6f48' : '1px solid transparent',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px',
  boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});
