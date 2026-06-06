import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as fabric from 'fabric';

const MugCanvasEditor = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);

  // Expõe a função addElement para o componente pai (ProfessionalSwissEditor)
  useImperativeHandle(ref, () => ({
    addElement: (id) => {
      if (!fabricCanvas.current) return;

      // Lógica simples: adiciona uma forma baseada no ID recebido
      let shape;
      if (id.includes('nature')) {
        shape = new fabric.Triangle({ width: 50, height: 50, fill: '#8b6f48', left: 100, top: 100 });
      } else if (id.includes('winter')) {
        shape = new fabric.Circle({ radius: 25, fill: '#00b4d8', left: 100, top: 100 });
      } else {
        shape = new fabric.Rect({ width: 50, height: 50, fill: '#ccc', left: 100, top: 100 });
      }

      fabricCanvas.current.add(shape);
      fabricCanvas.current.setActiveObject(shape);
      fabricCanvas.current.renderAll();
    }
  }));

  useEffect(() => {
    // Inicializa o Canvas do Fabric
    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 200,
      backgroundColor: 'transparent',
    });

    return () => {
      fabricCanvas.current.dispose();
    };
  }, []);

  return (
    <div style={{ border: '1px dashed #ccc', marginTop: '10px' }}>
      <canvas ref={canvasRef} />
    </div>
  );
});

export default MugCanvasEditor;