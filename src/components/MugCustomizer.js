import React, { useRef, useEffect, useState } from 'react';

function MugCustomizer() {
  const workerRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    // Inicializa o Worker (certifique-se que o worker.js está na pasta public)
    workerRef.current = new Worker('/worker.js');

    workerRef.current.onmessage = (e) => {
      const { processedImageData, width, height } = e.data;
      
      // Criar um canvas temporário para gerar a URL da imagem limpa
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      const imgData = new ImageData(new Uint8ClampedArray(processedImageData), width, height);
      tempCtx.putImageData(imgData, 0, 0);

      // Salva a imagem processada no estado
      setUserImage(tempCanvas.toDataURL());
      setIsProcessing(false);
    };

    return () => workerRef.current?.terminate();
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = hiddenCanvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        workerRef.current.postMessage({ imageData }, [imageData.data.buffer]);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', padding: '20px', gap: '40px', fontFamily: 'sans-serif' }}>
      {/* LADO ESQUERDO: Preview Realista */}
      <div style={{ flex: 1, textAlign: 'center', background: '#f5f5f5', borderRadius: '15px', padding: '20px' }}>
        <h3 style={{ color: '#8b6f48' }}>Vorschau</h3>
        
        <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto' }}>
          {/* Aqui você chamaria o seu componente MugSide ou MugEditor */}
          {userImage ? (
            <img 
              src={userImage} 
              alt="Preview" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 2, position: 'relative' }} 
            />
          ) : (
            <div style={{ border: '2px dashed #ccc', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
              Foto hochladen
            </div>
          )}
          
          {isProcessing && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <strong>Wird verarbeitet...</strong>
            </div>
          )}
        </div>
      </div>

      {/* LADO DIREITO: Controles */}
      <div style={{ width: '300px' }}>
        <label style={{ 
          display: 'block', 
          padding: '15px', 
          background: '#8b6f48', 
          color: 'white', 
          textAlign: 'center', 
          borderRadius: '8px', 
          cursor: 'pointer' 
        }}>
          Bild auswählen
          <input type="file" onChange={handleUpload} accept="image/*" style={{ display: 'none' }} />
        </label>
        
        <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />
        
        <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
 .
        </p>
      </div>
    </div>
  );
}

export default MugCustomizer;