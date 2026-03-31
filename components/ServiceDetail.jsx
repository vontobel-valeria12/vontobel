import React, { useEffect, useState } from 'react';
import './ServiceDetail.css';

/* 🔹 Dados das opções */
export const repairOptions = {
  hosen: [

    { id: "k_std", label: "Kürzen (Standard)", price: 12 },
    { id: "k_orig", label: "Originalsaum (Jeans)", price: 18 },
    { id: "rz_h", label: "Reissverschluss ersetzen", price: 18 },
    { id: "flick", label: "Flicken / Stopfen", price: 15 },
    { id: "taschen", label: "Taschen zunähen", price: 5 },
    { id: "futter", label: "Seitlich enger mit Futter", price: 20 },
    { id: "beidseitig", label: "Beidseitig enger + Bund", price: 20 },
    { id: "bund", label: "Bund seitlich enger / weiter", price: 18 }
  ],

  blaser: [
    { id: "a_k", label: "Ärmel kürzen", price: 20 },
    { id: "a_knopf", label: "Ärmel kürzen mit Knöpfen", price: 30 },
    { id: "seiten", label: "Seitennähte enger", price: 25 },
    { id: "schulter", label: "Schulter heben", price: 35 }
  ],

  hemden: [
    { id: "b_a2", label: "Kleine Risse oder Löcher flicken", price: 5 },
    { id: "h_k", label: "Ärmel kürzen", price: 15 },
    { id: "h_t", label: "Taillieren", price: 20 },
    { id: "h_seiten", label: "Seitennähte enger", price: 25 },
    { id: "b_a1", label: "Ärmel kürzen einfach", price: 8 },
    { id: "b_a2", label: "Ärmel kürzen mit Manschette", price: 15 },
    { id: "b_mans", label: "Manschette kürzen und enger", price: 25 },
    { id: "b_sch", label: "Schultern schmaler machen", price: 20 },
    { id: "b_seit", label: "Seiten verengen", price: 25 },
    { id: "b_len", label: "Länge kürzen", price: 12 }
  ],

  jacken: [
    { id: "jm_a1", label: "Ärmel kürzen", price: 30 },
    { id: "jm_a2", label: "Ärmel kürzen mit Aufschlag", price: 40 },
    { id: "jm_sch", label: "Schulter heben", price: 45 },
    { id: "jm_seit", label: "Seitennähte", price: 35 },
    { id: "jm_rz", label: "Reissverschluss einnähen", price: 50 },
    { id: "jm_tasch", label: "Taschen zunähen", price: 10 },
    { id: "jm_len", label: "Länge kürzen", price: 35 }
  ],

  kleider: [
    { id: "b_a2", label: "Kleine Risse oder Löcher flicken", price: 5 },
    { id: "k_len1", label: "Länge kürzen mit Futter", price: 25 },
    { id: "k_len2", label: "Länge kürzen mit Falten", price: 30 },
    { id: "k_len3", label: "Länge kürzen mit Plissee", price: 25 },
    { id: "k_seit", label: "Seitennaht enger", price: 30 },
    { id: "k_a1", label: "Ärmel kürzen einfach", price: 8 },
    { id: "k_a2", label: "Ärmel kürzen mit Manschette", price: 15 },
    { id: "k_sch", label: "Schulter heben", price: 35 },
    { id: "k_rz", label: "Reissverschluss einnähen", price: 45 }
  ],

  roecke: [
    { id: "b_a2", label: "Kleine Risse oder Löcher flicken", price: 5 },
    { id: "r_len1", label: "Länge kürzen", price: 18 },
    { id: "r_len2", label: "Länge mit Falten kürzen", price: 25 },
    { id: "r_len3", label: "Länge kürzen mit Plissee", price: 30 },
    { id: "r_seit", label: "Seitennähte enger", price: 25 },
    { id: "r_tasch", label: "Taschen zunähen", price: 8 },
    { id: "r_bund", label: "Bund enger / weiter", price: 20 }
  ]
};

function ServiceDetail({ service, onBack, onGoToBooking }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* 🔹 Sempre definido antes do return */
  const currentOptions = service ? repairOptions[service.id] || [] : [];
  const totalAmount = selectedOptions.reduce((sum, item) => sum + item.price, 0);

  if (!service) return null;

  const toggleOption = (option) => {
    setSelectedOptions(prev =>
      prev.some(item => item.id === option.id)
        ? prev.filter(item => item.id !== option.id)
        : [...prev, option]
    );
  };

  return (
    <div className="service-detail-view">
      <button className="back-link" onClick={onBack}>
        ← Zurück
      </button>

      <div className="calculator-layout">

        {/* Cabeçalho com imagem e título/total */}
        <div className="service-header-mini">
          <img src={service.image} alt={service.name} className="mini-img" />
          <div className="service-title-total">
            <h1>{service.name}</h1>
            <div className="total-row">
              <span>Voraussichtliches Total:</span>
              <strong>CHF {totalAmount.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Calculadora */}
        <div className="calculator-card">
          <h3>Gewünschte Änderungen auswählen:</h3>

          <div className="options-group">
            {currentOptions.length === 0 && <p>Keine Optionen verfügbar.</p>}

            {currentOptions.map(option => {
              const isActive = selectedOptions.some(item => item.id === option.id);

              return (
                <div
                  key={option.id}
                  className={`calc-option ${isActive ? 'active' : ''}`}
                  onClick={() => toggleOption(option)}
                >
                  <span className="opt-label">{option.label}</span>
                  <span className="opt-price">CHF {option.price.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          {/* Botão de criar ordem */}
          <button 
  className="btn-booking-direct"
  onClick={() => {
    const mensagem = encodeURIComponent("Grüezi! Ich möchte gerne einen Termin für eine Näharbeit anfragen.");
    window.open(`https://wa.me/41765019056?text=${mensagem}`, '_blank');
  }}
>
  Termin anfragen
</button>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;