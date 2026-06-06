import { useEffect, useRef, useState } from "react";
import interact from "interactjs";
import html2canvas from "html2canvas";

export default function MockupEditor() {
  const imageRef = useRef(null);
  const mockupAreaRef = useRef(null);

  const [userImage, setUserImage] = useState(null);
  const transformState = useRef({ x: 0, y: 0, scale: 1, rotation: 0 });
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  const updateTransform = () => {
    if (!imageRef.current) return;
    const { x, y, scale, rotation } = transformState.current;
    imageRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`;
  };

  const saveState = () => {
    const snap = JSON.stringify(transformState.current);
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(snap);
    historyIndexRef.current++;
  };

  const undo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    transformState.current = JSON.parse(historyRef.current[historyIndexRef.current]);
    updateTransform();
  };

  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    transformState.current = JSON.parse(historyRef.current[historyIndexRef.current]);
    updateTransform();
  };

  useEffect(() => {
    if (!imageRef.current) return;

    const element = imageRef.current;

    const interactable = interact(element)
      .draggable({
        modifiers: [interact.modifiers.restrictRect({ restriction: ".print-area", endOnly: true })],
        listeners: {
          move(event) {
            transformState.current.x += event.dx;
            transformState.current.y += event.dy;
            updateTransform();
          },
        },
      })
      .gesturable({
        listeners: {
          move(event) {
            transformState.current.scale *= 1 + event.ds;
            transformState.current.rotation += event.da;
            updateTransform();
          },
        },
      });

    const handleWheel = (event) => {
      event.preventDefault();
      const delta = event.deltaY < 0 ? 0.05 : -0.05;
      transformState.current.scale = Math.max(0.2, Math.min(transformState.current.scale + delta, 3));
      updateTransform();
    };

    const handleContextMenu = (event) => {
      event.preventDefault();
      transformState.current.rotation += 15;
      updateTransform();
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    element.addEventListener("contextmenu", handleContextMenu);

    return () => {
      interactable.unset();
      element.removeEventListener("wheel", handleWheel);
      element.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [userImage]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUserImage(url);
    saveState();
  };

  const exportImage = async () => {
    if (!mockupAreaRef.current) return;
    const canvas = await html2canvas(mockupAreaRef.current, { useCORS: true, backgroundColor: null, scale: 2 });
    const link = document.createElement("a");
    link.download = "design-mockup.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <div
        ref={mockupAreaRef}
        className="mockup-container"
        style={{ position: 'relative', width: 400, height: 400, margin: '0 auto', overflow: 'hidden' }}
      >
        <img src="/caneca.png" alt="Tasse" style={{ width: '100%' }} />
        <div
          className="print-area"
          style={{
            position: 'absolute',
            top: '20%',
            left: '25%',
            width: '50%',
            height: '50%',
            border: '1px dashed #ccc',
            overflow: 'hidden',
          }}
        >
          {userImage ? (
            <img
              ref={imageRef}
              src={userImage}
              alt="Benutzerfoto"
              style={{ width: '100%', touchAction: 'none', cursor: 'move', userSelect: 'none' }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: '#aaa', paddingTop: '50%' }}>Ziehen oder Bild hochladen</div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 15, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
        <label style={{ cursor: 'pointer', backgroundColor: '#8b6f48', color: '#fff', padding: '8px 15px', borderRadius: 4 }}>
          📷 Bild wählen
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
        </label>

        <button onClick={undo} style={{ padding: '8px 15px', backgroundColor: '#8b6f48', border: 'none', borderRadius: 4, cursor: 'pointer' }}>↩️ Rückgängig</button>
        <button onClick={redo} style={{ padding: '8px 15px', backgroundColor: '#8b6f48', border: 'none', borderRadius: 4, cursor: 'pointer' }}>↪️ Wiederholen</button>
        <button onClick={exportImage} style={{ padding: '8px 15px', backgroundColor: '#8b6f48', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>💾 Export</button>
      </div>
    </div>
  );
}