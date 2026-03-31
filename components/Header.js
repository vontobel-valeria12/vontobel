import React from 'react';
import { Link } from 'react-router-dom';

function Header({ cartCount, favoritesCount, onGoHome, onSearch, onShowLogin }) { 
  return (
    <header className="top-nav">
      <div className="top-container">
        
        {/* LOGO */}
        <Link 
          to="/" 
          className="logo" 
          onClick={onGoHome} 
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
        >
          <img src="logo.jpeg" alt="Logo" />
          <p>Kreative Näharbeiten</p>
        </Link>

        {/* BUSCA */}
        <div className="search-bar">
          <input 
            placeholder="Suchen..." 
            type="text" 
            onChange={(e) => onSearch(e.target.value)} 
          />
          <button>🔍</button>
        </div>

        {/* MENU DO USUÁRIO E ÍCONES */}
        <div className="user-menu-container">
          <div className="header-icons">
            
            {/* ❤️ SECÇÃO DE FAVORITOS */}
            <div className="header-item" onClick={onShowLogin} style={{ cursor: 'pointer' }}>
              <span role="img" aria-label="favorites">❤️</span>
              {favoritesCount > 0 && (
                <span className="badge">{favoritesCount}</span>
              )}
            </div>

            {/* 🛒 CARRINHO */}
            <div className="header-item">
              <span role="img" aria-label="cart">🛒</span>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </div>

            {/* 👤 MEIN KONTO / LOGIN */}
            <button className="login-button" onClick={onShowLogin}>
              👤 Mein Konto
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;