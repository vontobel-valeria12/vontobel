import React from 'react';

// Recebemos onSelectCategory como "prop" vinda do App.js
function Categories({ onSelectCategory }) {
  return (
    <nav className="categorias-nav">
      <div className="categorias-container">
        
   
        <div 
          className="categoria-item" 
          onClick={() => onSelectCategory('Sewing')}
          style={{ cursor: 'pointer' }}
        >
          <div className="circulo">
            <img src="/produtodecostura.jfif" alt="Näharbeiten" />
          </div>
          <span>Näharbeiten</span>
        </div>

       
        <div 
          className="categoria-item" 
          onClick={() => onSelectCategory('Repairs')}
          style={{ cursor: 'pointer' }}
        >
          <div className="circulo">
            <img src="/reparo.jfif" alt="Änderungen" />
          </div>
          <span>Kleiderreparatur</span>
        </div>

       
        <div 
          className="categoria-item" 
          onClick={() => onSelectCategory('Personalized')}
          style={{ cursor: 'pointer' }}
        >
          <div className="circulo">
            <img src="/personalizados.jfif" alt="Geschenke" />
          </div>
          <span>Geschenke</span>
        </div>
        
      </div>
    </nav>
  );
}

export default Categories;