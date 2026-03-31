import React from 'react';
import './SectionRepairs.css';

import imgHosen from '../assets/BackgroundEraser_20260328_082454511.webp';
import imgBlaser from '../assets/BackgroundEraser_20260328_085149500 (1).webp';
import imgHemden from '../assets/BackgroundEraser_20260328_093522655.webp';
import imgRoecke from '../assets/BackgroundEraser_20260328_091548611.webp';
import imgKleider from '../assets/BackgroundEraser_20260328_083810335.webp';
import imgJacken from '../assets/BackgroundEraser_20260328_100302160.webp';

function SectionRepairs({ onSelectService, searchTerm }) {
  
  const repairCategories = [
    { 
      id: 'hosen', 
      title: "Hosen & Jeans", 
      image: imgHosen, 
      details: "Kürzen, enger machen, Reissverschluss ersetzen, flicken."
    },
    { 
      id: 'blaser', 
      title: "Blazer & Sakko", 
      image: imgBlaser,
      details: "Ärmel kürzen, Schultern anpassen, Futter reparieren."
    },
    { 
      id: 'hemden', 
      title: "Hemden & Blusen", 
      image: imgHemden,
      details: "Ärmel kürzen, Taillieren, Kragen wenden."
    },
    { 
      id: 'roecke', 
      title: "Röcke", 
      image: imgRoecke,
      details: "Länge anpassen, Reissverschluss, enger machen."
    },
    { 
      id: 'kleider', 
      title: "Kleider", 
      image: imgKleider,
      details: "Länge anpassen, Reissverschluss, enger machen."
    },
    { 
      id: 'jacken', 
      title: "Jacken & Mäntel", 
      image: imgJacken,
      details: "Reissverschluss ersetzen, Futter, neue Knöpfe."
    }
  ];

 const filteredRepairs = repairCategories.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. A VERIFICAÇÃO DE RESULTADOS
  if (searchTerm && filteredRepairs.length === 0) return null;
  return (
    <section className="section-repairs">
      <div className="repairs-grid">
        {/* CORREÇÃO AQUI: Usar a lista filtrada para o map */}
        {filteredRepairs.map(item => (
          <div key={item.id} className="repair-card">
            
            <div className="repair-image-container">
              <img 
                src={item.image} 
                alt={item.title} 
                className="repair-image"
              />
            </div>

            <div className="repair-content">
              <h3 className="repair-item-title">{item.title}</h3>
              <p className="repair-details">{item.details}</p>
              
              <button 
                className="btn-quote"
                onClick={() => onSelectService({
                  id: item.id,   
                  name: item.title,
                  description: item.details,
                  image: item.image,
                  images: [item.image] 
                })}
              >
                Offerte anfragen
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SectionRepairs;