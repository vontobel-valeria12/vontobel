import React from 'react';
import { Link } from 'react-router-dom';

function CartPage({ cart, onRemove }) {
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  // PORTA 1: O caminho pessoal (WhatsApp)
  const handleWhatsAppCheckout = () => {
    const message = cart
      .map((item) => `- ${item.name}: CHF ${item.price.toFixed(2)}`)
      .join('%0A');
    const whatsappUrl = `https://wa.me/41765019056?text=Grüezi! Ich möchte folgendes bestellen:%0A%0A${message}%0A%0ATotal: CHF ${total.toFixed(2)}`;
    window.open(whatsappUrl, '_blank');
  };

  // PORTA 2: O caminho automático (Stripe)
  const handleStripeCheckout = async () => {
    console.log("Iniciando checkout seguro com Stripe...");
    // Aqui conectaremos com a sua conta Stripe no próximo passo
    alert("Verbindung zum Stripe-Gateway... (Em desenvolvimento)");
  };

  return (
    <div className="cart-page-container" style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', color: '#8b6f47' }}>Ihr Warenkorb</h2>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Der Warenkorb ist leer.</p>
          <Link to="/" className="btn-back">Zurück zum Shop</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          
          {/* Lado Esquerdo: Lista de Produtos */}
          <div style={{ flex: '1.5', minWidth: '300px' }}>
            {cart.map((item, index) => (
              <div key={item.cartId || index} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                <img src={item.image} alt={item.name} style={{ width: '60px', borderRadius: '5px' }} />
                <div style={{ flex: 1, marginLeft: '15px' }}>
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>CHF {item.price.toFixed(2)}</p>
                </div>
                <button onClick={() => onRemove(item.cartId || index)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>Entfernen</button>
              </div>
            ))}
          </div>

      
          <div style={{ flex: '1', minWidth: '300px', background: '#fdfbf7', padding: '25px', borderRadius: '12px', border: '1px solid #f1ece4' }}>
            <h3 style={{ marginTop: 0 }}>Zusammenfassung</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
              <span>Total:</span>
              <span style={{ color: '#8b6f47' }}>CHF {total.toFixed(2)}</span>
            </div>

         
            <button 
              onClick={handleStripeCheckout}
              style={{ width: '100%', padding: '15px', backgroundColor: '#6772e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}
            >
              💳 Mit Karte bezahlen (Stripe)
            </button>

          
            <button 
              onClick={handleWhatsAppCheckout}
              style={{ width: '100%', padding: '15px', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              💬 Per WhatsApp bestellen
            </button>

            <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '15px' }}>
              Wählen Sie Ihre bevorzugte Zahlungsmethode.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;