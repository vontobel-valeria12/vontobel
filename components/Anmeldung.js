import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Anmeldung = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [passwort, setPasswort] = useState('');
  const [fehler, setFehler] = useState('');
  const [laden, setLaden] = useState(false);
  
  const { anmelden } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setFehler('');
    setLaden(true);

    try {
  
      await anmelden(email, passwort);
      console.log("Login bem-sucedido no Firebase!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro detalhado:", error.code);
    
      if (error.code === 'auth/invalid-credential') {
        setFehler('E-Mail oder Passwort ist nicht korrekt.');
      } else {
        setFehler('Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } finally {
      setLaden(false);
    }
  }

  return (
    <div className="login-container">
      <h2 style={{ textAlign: 'center', color: '#8b6f48' }}>Anmeldung</h2>
      
      {fehler && <p style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{fehler}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>E-Mail Adresse</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="beispiel@mail.ch"
          />
        </div>

        <div className="form-group">
          <label>Passwort</label>
          <input 
            type="password" 
            value={passwort} 
            onChange={(e) => setPasswort(e.target.value)} 
            required 
            placeholder="Ihr Passwort"
          />
        </div>

        <button disabled={laden} type="submit" className="btn-repair">
          {laden ? 'Wird geladen...' : 'Anmelden'}
        </button>
      </form>
    </div>
  );
};

export default Anmeldung;