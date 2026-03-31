import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#333', 
      color: '#fff', 
      padding: '50px 20px 20px', 
      marginTop: '60px',
      borderTop: '4px solid #8b6f48' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '40px' 
      }}>
        
        {/* Sobre */}
        <div>
          <h3 style={{ color: '#d4a373', marginBottom: '15px' }}>Kreativ Näharbeiten</h3>
          <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.6' }}>
            Handgefertigte Unikate und professionelle Näharbeiten. 
            Jedes Stück wird mit Liebe zum Detail in der Schweiz gefertigt.
          </p>
        </div>

        {/* Contato Rápido */}
        <div>
          <h4 style={{ marginBottom: '15px' }}>Kontakt & Support</h4>
          <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '8px' }}>📍 Schweiz / Suisse</p>
          <a 
            href="https://wa.me/41765019056" 
            target="_blank" 
            rel="noreferrer" 
            style={{ color: '#25D366', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}
          >
            💬 Jetzt per WhatsApp kontaktieren
          </a>
          <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '10px' }}>
            Mo. - Fr.: 09:00 - 18:00
          </p>
        </div>

        {/* Links ou Informação de Encomenda */}
        <div>
          <h4 style={{ marginBottom: '15px' }}>Bestellungen</h4>
          <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.6' }}>
            Da jedes Produkt personalisiert wird, erfolgt die Bestellung direkt über WhatsApp. 
            So garantieren wir höchste Qualität für Ihre Wünsche.
          </p>
        </div>

      </div>

      {/* Direitos Autorais */}
      <div style={{ 
        borderTop: '1px solid #444', 
        marginTop: '40px', 
        paddingTop: '20px', 
        textAlign: 'center', 
        fontSize: '0.8rem', 
        color: '#888' 
      }}>
        © 2026 Kreativ Näharbeiten - Valéria Vontobel | Alle Rechte vorbehalten.
      </div>
    </footer>
  );
};

export default Footer;