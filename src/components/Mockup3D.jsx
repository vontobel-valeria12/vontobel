import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { saveAs } from "file-saver";

export default function Mockup3DCaneca({ initialColor = "#ffffff" }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cupGroupRef = useRef(new THREE.Group());
  const cameraRef = useRef(null);
  const requestRef = useRef();
  const textureRef = useRef(null);

  const transformRef = useRef({ offsetX: 0, offsetY: 0, scale: 1, rotation: 0 });
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);
  const isDraggingRef = useRef(false);
  const prevPos = useRef({ x: 0, y: 0 });

  const [cupColor, setCupColor] = useState(initialColor);
  const [userImage, setUserImage] = useState(null);

  // --- Inicialização da cena 3D ---
  useEffect(() => {
    const width = 500;
    const height = 500;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;
    cameraRef.current = camera;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(10, 20, 10);
    sceneRef.current.add(ambientLight, pointLight);

    // Caneca (cilindro + alça)
    const geometry = new THREE.CylinderGeometry(5, 5, 12, 64);
    const material = new THREE.MeshPhongMaterial({ color: cupColor });
    const body = new THREE.Mesh(geometry, material);

    const handleGeo = new THREE.TorusGeometry(3, 0.8, 16, 100, Math.PI);
    const handle = new THREE.Mesh(handleGeo, material);
    handle.position.set(4.5, 0, 0);
    handle.rotation.z = Math.PI / 2;

    cupGroupRef.current.add(body, handle);
    sceneRef.current.add(cupGroupRef.current);

    const animate = () => {
      renderer.render(sceneRef.current, camera);
      requestRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(requestRef.current);
      renderer.dispose();
      geometry.dispose();
      handleGeo.dispose();
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // --- Upload da foto do usuário ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUserImage(url);
    saveState();
  };

  useEffect(() => {
    if (!userImage) return;
    const loader = new THREE.TextureLoader();
    loader.load(userImage, (tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      textureRef.current = tex;
      cupGroupRef.current.children[0].material.map = tex;
      cupGroupRef.current.children[0].material.needsUpdate = true;
      applyTransform();
    });
  }, [userImage]);

  // --- Transformações da textura ---
  const applyTransform = () => {
    if (!textureRef.current) return;
    textureRef.current.offset.set(transformRef.current.offsetX, transformRef.current.offsetY);
    textureRef.current.repeat.set(1 / transformRef.current.scale, 1 / transformRef.current.scale);
    textureRef.current.rotation = transformRef.current.rotation;
  };

  // --- Drag da textura ---
  useEffect(() => {
    const canvas = rendererRef.current.domElement;
    const handleStart = (e) => {
      isDraggingRef.current = true;
      const pos = e.touches ? e.touches[0] : e;
      prevPos.current = { x: pos.clientX, y: pos.clientY };
    };
    const handleMove = (e) => {
      if (!isDraggingRef.current || !textureRef.current) return;
      const pos = e.touches ? e.touches[0] : e;
      const dx = (pos.clientX - prevPos.current.x) / 500;
      const dy = (pos.clientY - prevPos.current.y) / 500;
      transformRef.current.offsetX -= dx;
      transformRef.current.offsetY += dy;
      prevPos.current = { x: pos.clientX, y: pos.clientY };
      applyTransform();
    };
    const handleEnd = () => {
      if (isDraggingRef.current) saveState();
      isDraggingRef.current = false;
    };

    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    return () => {
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
    };
  }, []);

  // --- Undo / Redo ---
  const saveState = () => {
    const snap = JSON.stringify(transformRef.current);
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(snap);
    historyIndexRef.current++;
  };

  const undo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    transformRef.current = JSON.parse(historyRef.current[historyIndexRef.current]);
    applyTransform();
  };

  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    transformRef.current = JSON.parse(historyRef.current[historyIndexRef.current]);
    applyTransform();
  };

  // --- Exportação em alta resolução ---
  const exportHighRes = () => {
    const renderer = rendererRef.current;
    renderer.setSize(2400, 2400, false);
    renderer.render(sceneRef.current, cameraRef.current);
    renderer.domElement.toBlob((blob) => {
      saveAs(blob, "tassen-design.png");
      renderer.setSize(500, 500, false);
    });
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-lg">
      <div ref={mountRef} className="relative border rounded-lg overflow-hidden cursor-move">
        {!userImage && <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">Bild hierher ziehen oder auswählen</div>}
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded text-center">
          📷 
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>

        <button onClick={() => (cupGroupRef.current.rotation.y = 0)} className="bg-gray-200 p-2 rounded">Vorderseite</button>
        <button onClick={() => (cupGroupRef.current.rotation.y = Math.PI / 2)} className="bg-gray-200 p-2 rounded">Seite</button>
        <button onClick={() => (cupGroupRef.current.rotation.y = Math.PI)} className="bg-gray-200 p-2 rounded">Rückseite</button>

        <button onClick={undo} className="bg-yellow-500 text-white p-2 rounded">Rückgängig</button>
        <button onClick={redo} className="bg-yellow-500 text-white p-2 rounded">Wiederholen</button>

        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded">
          <span>Farbe:</span>
          <input type="color" value={cupColor} onChange={(e) => {
            setCupColor(e.target.value);
            cupGroupRef.current.children.forEach(c => c.material.color.set(e.target.value));
          }} />
        </div>

        <button onClick={exportHighRes} className="bg-green-600 text-white p-2 rounded">PNG Export</button>
      </div>

      <div className="mt-6">
        <button className="bg-brown-600 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-brown-700 transition">
          Speichern & zum Warenkorb
        </button>
      </div>
    </div>
  );
}
