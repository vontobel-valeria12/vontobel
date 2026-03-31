import React from 'react';

function ProductCard({ image, name, price, onClick, isFavorite, onToggleFavorite }) {
  
  // Objetos de Estilo (Baseados no seu CSS)
  const styles = {
    repairCard: {
      background: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #eee',
      cursor: 'pointer'
    },
    imageContainer: {
      width: '100%',
      aspectRatio: '1 / 1',
      overflow: 'hidden',
      backgroundColor: '#f9f9f9',
      position: 'relative'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    btnFav: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'rgba(255, 255, 255, 0.85)',
      border: 'none',
      borderRadius: '50%',
      width: '35px',
      height: '35px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      zIndex: 2,
      fontSize: '1.2rem'
    },
    content: {
      padding: '10px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    },
    title: {
      fontSize: '0.9rem',
      marginBottom: '5px',
      color: '#333',
      fontWeight: 'bold'
    },
    details: {
      fontSize: '0.7rem',
      color: '#777',
      marginBottom: '12px',
      lineHeight: '1.2'
    },
    btnQuote: {
      width: '100%',
      backgroundColor: '#8b6f48',
      color: '#fff',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '50px',
      fontSize: '0.7rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      cursor: 'pointer',
      transition: 'background 0.2s'
    }
  };

  return (
    <div style={styles.repairCard} onClick={onClick}>
      
      <div style={styles.imageContainer}>
        <img 
          src={image} 
          alt={name} 
          style={styles.image} 
        />
        
        <button 
          style={styles.btnFav}
          onClick={(e) => {
            e.stopPropagation(); 
            onToggleFavorite();
          }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{name}</h3>
        <p style={styles.details}>{price} CHF</p>
        
        <button 
          style={styles.btnQuote}
          onClick={(e) => {
            e.stopPropagation(); 
            onClick();
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#744d16'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#8b6f48'}
        >
          Details ansehen
        </button>
      </div>
    </div>
  );
}

export default ProductCard;