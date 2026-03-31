import React, { useState } from 'react';

// Assets (Pfade beibehalten)
import imgFarbwechsel from '../assets/tasse que muda de cor.jpg';
import imgWeiss from '../assets/mug.png';

const THEME = {
  accent: "#8b6f48",
  border: "#EAEAEA",
  bgActive: "#FDFBF7",
  text: "#555",
  success: "#2D5A27" // Ein dezentes Grün für Bestätigungen
};

const ProductList = ({ onSelect }) => {
  const PRODUCT_OPTIONS = [
    { id: 'p1', name: "Tasse Farbwechsel", price: 25.00, img: imgFarbwechsel, description: "Magischer Effekt bei Hitze." },
    { id: 'p2', name: "Tasse Weiss", price: 16.00, img: imgWeiss, description: "Klassische Keramiktasse." },
    { id: 'p3', name: "Tasse Premium", price: 20.00, img: imgWeiss, description: "Hochwertiges Porzellan." },
    { id: 'p4', name: "Tasse Matt Black", price: 20.00, img: imgFarbwechsel, description: "Edles mattes Finish." },
  ];

  const [selectedProduct, setSelectedProduct] = useState(PRODUCT_OPTIONS[0]);
  const [quantidade, setQuantidade] = useState(1);

  // Berechnung des Gesamtpreises für die Anzeige
  const totalPrice = (selectedProduct.price * quantidade).toFixed(2);

  const handleSelection = (product) => {
    setSelectedProduct(product);
    setQuantidade(1);
    // Sofortige Rückmeldung an den Haupt-Editor (falls benötigt)
    if (onSelect) onSelect(product);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
    
      <div>
        <h3 style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", color: "#bbb", marginBottom: "15px", letterSpacing: "1px" }}>
          Produkt wählen
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {PRODUCT_OPTIONS.map((product) => {
            const isActive = selectedProduct.id === product.id;
            return (
              <div 
                key={product.id}
                onClick={() => handleSelection(product)}
                style={{
                  cursor: 'pointer',
                  padding: '15px',
                  borderRadius: '12px',
                  border: `2px solid ${isActive ? THEME.accent : THEME.border}`,
                  backgroundColor: isActive ? THEME.bgActive : '#fff',
                  textAlign: 'center',
                  transition: 'all 0.2s ease-in-out',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isActive ? '0 8px 20px rgba(139, 111, 72, 0.1)' : 'none'
                }}
              >
                <img src={product.img} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', marginBottom: '10px' }} />
                <div style={{ fontSize: '12px', fontWeight: '800', color: isActive ? THEME.accent : '#333', marginBottom: '4px' }}>{product.name}</div>
                <div style={{ fontSize: '11px', color: '#999' }}>CHF {product.price.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: `1px solid ${THEME.border}`, margin: '10px 0' }} />

      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: THEME.text }}>Menge</span>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '8px', border: `1px solid ${THEME.border}` }}>
            <button onClick={() => setQuantidade(q => Math.max(1, q - 1))} style={qtyBtnStyle}>-</button>
            <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold' }}>{quantidade}</span>
            <button onClick={() => setQuantidade(q => q + 1)} style={qtyBtnStyle}>+</button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#bbb', fontWeight: 'bold', textTransform: 'uppercase' }}>Zwischensumme</div>
            <div style={{ fontSize: '24px', fontWeight: '300' }}>CHF {totalPrice}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const qtyBtnStyle = {
  padding: '10px 15px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '16px',
  color: '#8b6f48',
  fontWeight: 'bold'
};

export default ProductList;