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

      
        <div className="header-right">
          <div className="header-icons-group">
            
            {/* Favoriten Icon */}
            <button className="icon-button" onClick={onShowLogin}>
              <span className="icon-emoji">❤️</span>
              {favoritesCount > 0 && <span className="badge">{favoritesCount}</span>}
            </button>

            {/* Login/User Icon */}
            <button className="icon-button" onClick={onShowLogin}>
              <span className="icon-emoji">👤 LOGIN</span>
            </button>
            
          </div>
        </div>

      </div>
    </header>
  );
}



export default Header;