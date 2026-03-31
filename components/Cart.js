import React from 'react';
import './Cart.css';

function Cart({ cartItems, onUpdateQuantity, onRemove, onBack }) {
  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    // Cria a mensagem para o WhatsApp
    const message = cartItems.map(item => `${item.quantity}x ${item.name} (CHF ${item.price})`).join('%0A');
    const whatsappUrl = `https://wa.me/41765019056?text=Grüezi! Ich möchte folgendes bestellen:%0A${message}%0A%0ATotal: CHF ${total.toFixed(2)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="cart-container">
      <button onClick={onBack} className="back-link">← Weiter einkaufen</button>
      <h2>Ihr Warenkorb 🛒</h2>

      {cartItems.length === 0 ? (
        <p>Der Warenkorb ist leer.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>CHF {item.price.toFixed(2)}</p>
                </div>
                <div className="item-controls">
                  <span>Menge: {item.quantity}</span>
                  <button onClick={() => onRemove(item.id)}>Löschen</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Gesamtsumme: CHF {total.toFixed(2)}</h3>
            <button className="btn-checkout" onClick={handleCheckout}>
              Bestellung via WhatsApp (Checkout)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;