import React from 'react';

function ProductDetailPersonalized({ product, onBack }) {
  if (!product) return null;

  // Link do WhatsApp com mensagem específica para personalização
  const whatsappNumber = "41765019056";
  const message = encodeURIComponent(`Hallo Valéria! Ich interessiere mich für die Personalisierung von: ${product.name}. Können wir die Details besprechen?`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <section className="product-detail-view" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Botão de Voltar */}
      <button 
        onClick={onBack} 
        className="back-link" 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          color: '#8b6f47', 
          fontWeight: 'bold', 
          marginBottom: '30px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '1rem' 
        }}
      >
        ← Zurück zur Übersicht
      </button>

      <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px' }}>
        
        {/* LADO ESQUERDO: IMAGEM DO PRODUTO */}
        <div className="detail-image-container">
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ 
              width: '100%', 
              borderRadius: '15px', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              objectFit: 'cover' 
            }} 
          />
        </div>

        {/* LADO DIREITO: INFORMAÇÕES */}
        <div className="detail-info-container">
          <h1 style={{ color: '#333', fontSize: '2.2rem', marginBottom: '10px' }}>{product.name}</h1>
          <p style={{ color: '#8b6f47', fontSize: '1.2rem', fontWeight: '600', marginBottom: '20px' }}>
            Individuelle Handarbeit auf Bestellung
          </p>
          
          <div className="product-description" style={{ color: '#555', lineHeight: '1.7', marginBottom: '30px' }}>
            <p>{product.description || "Dieses Produkt wird individuell nach Ihren Wünschen gefertigt."}</p>
          </div>

          {/* BANNER DE ATENDIMENTO PERSONALIZADO */}
          <div className="human-service-card" style={{ 
            background: '#fdf8f3', 
            padding: '25px', 
            borderRadius: '12px', 
            borderLeft: '4px solid #d4a373',
            marginBottom: '30px' 
          }}>
            <h3 style={{ marginTop: 0, color: '#8b6f47', fontSize: '1.1rem', marginBottom: '10px' }}>
              Persönliche Beratung & Unikate
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: 0, lineHeight: '1.5' }}>
              Jedes personalisierte Stück ist ein <strong>Unikat</strong>. Bei mir gibt es keine Massenware e 
              keine automatischen Prozesse. 
              <br /><br />
              Wir besprechen jeden Schritt – von der Farbwahl bis zur Bestickung – 
              <strong>persönlich via WhatsApp</strong>, damit Ihr Wunschprodukt genau so wird, wie Sie es sich vorstellen.
            </p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#333' }}>
              Ab CHF {Number(product.price).toFixed(2)}
            </span>
          </div>

          {/* BOTÃO DE AÇÃO PARA WHATSAPP */}
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <button 
              className="btn-quote" 
              style={{ 
                width: '100%', 
                padding: '18px', 
                fontSize: '1.1rem', 
                backgroundColor: '#8b6f47', 
                color: 'white', 
                border: 'none', 
                borderRadius: '50px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span>💬</span> Jetzt persönlich anfragen
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPersonalized;