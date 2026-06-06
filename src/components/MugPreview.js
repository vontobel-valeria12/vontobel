const MugSide = ({ title, mugImg, maskImg, userPhoto, settings }) => {
  return (
    <div style={{ flex: 1, textAlign: 'center', margin: '10px' }}>
      <h3>{title}</h3>
      <div style={{ 
        position: 'relative', 
        width: '300px', 
        height: '350px', 
        margin: '0 auto',
        overflow: 'hidden',
        backgroundColor: '#f9f9f9' // Fundo neutro
      }}>
        {/* Nível 1: Caneca Base ☕ */}
        <img src={mugImg} style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1 }} />

        {/* Nível 2: Foto do Cliente 📸 */}
        <div style={{ 
          position: 'absolute', 
          top: '50px', // Ajuste conforme a área da sua caneca
          left: '50px', 
          width: '200px', 
          height: '200px', 
          zIndex: 2,
          overflow: 'hidden'
        }}>
          {userPhoto && (
            <img 
              src={userPhoto} 
              style={{
                width: '100%',
                transform: `scale(${settings.zoom}) translate(${settings.x}px, ${settings.y}px)`
              }} 
            />
          )}
        </div>

        {/* Nível 3: Máscara (Overlay) 🖼️ */}
        <img src={maskImg} style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 3, pointerEvents: 'none' }} />
      </div>
    </div>
  );
};