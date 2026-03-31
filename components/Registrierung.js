import React, { useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const Registrierung = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="atelier-registration" style={{ padding: '40px', maxWidth: '450px', margin: 'auto' }}>
      <h2 style={{ fontFamily: 'serif', textAlign: 'center', color: '#333' }}>Konto erstellen</h2>
      
      <form>
        {/* Anrede - Professionell wie bei Migros */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.8rem', textTransform: 'uppercase' }}>Anrede</label>
          <input type="radio" id="frau" name="anrede" /> <label htmlFor="frau" style={{ marginRight: '20px' }}>Frau</label>
          <input type="radio" id="herr" name="anrede" /> <label htmlFor="herr">Herr</label>
        </div>

        {/* E-Mail */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem' }}>E-Mail-Adresse</label>
          <input type="email" style={{ width: '100%', border: 'none', borderBottom: '1px solid #d4af37', padding: '8px 0' }} />
        </div>

        {/* Name & Vorname in einer Zeile für Eleganz */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.8rem' }}>Vorname</label>
            <input type="text" style={{ width: '100%', border: 'none', borderBottom: '1px solid #d4af37', padding: '8px 0' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.8rem' }}>Nachname</label>
            <input type="text" style={{ width: '100%', border: 'none', borderBottom: '1px solid #d4af37', padding: '8px 0' }} />
          </div>
        </div>

        {/* Passwort mit "Auge"-Symbol wie bei Migros */}
        <div style={{ marginBottom: '30px', position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '0.8rem' }}>Passwort</label>
          <input 
            type={showPassword ? "text" : "password"} 
            style={{ width: '100%', border: 'none', borderBottom: '1px solid #d4af37', padding: '8px 0' }} 
          />
          <span 
            onClick={() => setShowPassword(!showPassword)} 
            style={{ position: 'absolute', right: '0', bottom: '8px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            {showPassword ? "Verbergen" : "Anzeigen"}
          </span>
        </div>

        {/* Rechtliches - Sehr wichtig in der Schweiz! */}
        <p style={{ fontSize: '0.75rem', color: '#666', lineHeight: '1.4' }}>
          Indem Sie fortfahren, akzeptieren Sie die 
          <a href="/agb" style={{ color: '#d4af37', textDecoration: 'none' }}> Nutzungsbedingungen </a> 
          und die 
          <a href="/datenschutz" style={{ color: '#d4af37', textDecoration: 'none' }}> Datenschutzerklärung </a>.
        </p>

        <button style={{ 
          width: '100%', 
          padding: '15px', 
          backgroundColor: '#333', 
          color: '#fff', 
          border: 'none', 
          marginTop: '20px',
          letterSpacing: '1px'
        }}>
          WEITER
        </button>
      </form>
    </div>
  );
};
export default Registrierung;