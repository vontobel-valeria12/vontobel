import React, { useState, useEffect } from 'react';
import './ProductDetail.css';

function ProductDetail({ product, onBack }) {
  const [mainImg, setMainImg] = useState(product?.image);

  useEffect(() => {
    if (product) {
      setMainImg(product.image);
    }
  }, [product]);

  if (!product) return null;

  // Link do WhatsApp com mensagem automática
  const whatsappNumber = "41765019056";
  const message = encodeURIComponent(`Grüezi Valéria, ich interessiere mich für: ${product.name}. Können wir die Details besprechen?`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <main className="main-content">
      <div className="back-button-container">
        <button className="back-link" onClick={onBack}>
          ← Zurück zur Übersicht
        </button>
      </div>

      <div className="product-detail-layout" style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
        <div className="galeria-container">
          <div className="sidebar-miniaturas">
            {product.images && product.images.map((img, index) => (
              <img 
                key={index}
                className={`thumb-v ${mainImg === img ? 'ativo' : ''}`} 
                src={img} 
                onClick={() => setMainImg(img)} 
                alt={`Ansicht ${index + 1}`} 
              />
            ))}
          </div>
          <div className="foto-foco">
            <img src={mainImg} alt={product.name} style={{ borderRadius: '15px', width: '100%' }} />
          </div>
        </div>

        <div className="product-info" style={{ flex: 1 }}>
          <h1>{product.name}</h1>
          <p style={{ color: '#8b6f48', fontWeight: 'bold', marginBottom: '10px' }}>
            Handgefertigt & Auf Bestellung
          </p>
          
          <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
            {product.description}
          </p>

          {/* Texto explicativo sobre o trabalho manual */}
          <div style={{ 
            backgroundColor: '#fdf8f2', 
            padding: '15px', 
            borderRadius: '10px', 
            borderLeft: '4px solid #8b6f48',
            marginBottom: '20px' 
          }}>
            <p style={{ fontSize: '0.9rem', margin: 0, color: '#555' }}>
              <strong>Handarbeit mit Liebe:</strong> Jedes Stück wird von mir persönlich von Hand gefertigt. 
              Da es sich um Individualanfertigungen handelt, besprechen wir alle Details 
              (Farben, Stoffe, Personalisierung) direkt via WhatsApp.
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
              Ab CHF {Number(product.price).toFixed(2)}
            </span>
          </div>

          {/* Botão do WhatsApp */}
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <button className="btn-comprar" style={{ 
              backgroundColor: '#8b6f48', 
              color: 'white', 
              border: 'none',
              padding: '15px 25px',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%'
            }}>
              <span>💬</span> Jetzt per WhatsApp bestellen
            </button>
          </a>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;