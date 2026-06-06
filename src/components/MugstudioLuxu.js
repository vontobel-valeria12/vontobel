import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { saveAs } from "file-saver";

export default function MugStudioLuxo() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const mugRef = useRef(null);
  const textureRef = useRef(null);

  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current; // referência local segura
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Cena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050505");
    sceneRef.current = scene;

    // Câmera
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    camera.position.set(15, 8, 20);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Luz
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 15, 10);
    scene.add(ambient, dirLight);

    // Caneca
    const material = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.05,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      ior: 1.45,
      reflectivity: 0.5,
    });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 10, 128), material);
    body.name = "corpo";

    const handle = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.6, 16, 100, Math.PI), material);
    handle.position.set(4, 0, 0);
    handle.rotation.z = Math.PI / 2;

    const group = new THREE.Group();
    group.add(body, handle);
    scene.add(group);
    mugRef.current = group;

    // Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = !logoUrl;

    // Animação
    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.005; // rotação automática
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup seguro
    return () => {
      renderer.dispose();
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [logoUrl]);

  // Upload de logo/textura
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setLogoUrl(url);

    new THREE.TextureLoader().load(url, (tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2.5, 2.5);
      const corpo = mugRef.current?.getObjectByName("corpo");
      if (corpo) {
        corpo.material.map = tex;
        corpo.material.needsUpdate = true;
      }
    });
  };

  // Export PNG
  const exportPNG = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    const originalSize = renderer.getSize(new THREE.Vector2());
    renderer.setSize(2000, 2000);
    renderer.render(sceneRef.current, cameraRef.current);

    renderer.domElement.toBlob((blob) => {
      saveAs(blob, "mug-mockup.png");
      renderer.setSize(originalSize.x, originalSize.y);
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div ref={mountRef} style={{ width: 500, height: 500, margin: "auto" }} />

      <div style={{ marginTop: 20 }}>
        <label
          style={{
            padding: "10px 20px",
            background: "#8b6f48",
            color: "#fff",
            borderRadius: 6,
            cursor: "pointer",
            marginRight: 10,
          }}
        >
          Upload Logo
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
        </label>

        <button
          onClick={exportPNG}
          style={{ padding: "10px 20px", background: "black", color: "white", borderRadius: 6, cursor: "pointer" }}
        >
          Export PNG
        </button>
      </div>
    </div>
  );
}