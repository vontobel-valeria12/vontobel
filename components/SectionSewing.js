import React from 'react';
import ProductCard from './ProductCard';

// Imports der Fotos (Lokale Assets)
import img04 from '../assets/BackgroundEraser_20260328_144131561.webp';
import img06 from '../assets/06.jpeg';
import img07 from '../assets/07.jpeg';
import img12 from '../assets/1774707180412.webp';
import img14 from '../assets/14.jpeg';
import img15 from '../assets/15.jpeg';
import img20 from '../assets/BackgroundEraser_20260328_145041834.webp';
import img21 from '../assets/21.jpeg';
import img22 from '../assets/22.jpeg';
import img23 from '../assets/BackgroundEraser_20260328_145935914.webp';

function SectionSewing({ onAdd, onSelectProduct, searchTerm, favorites, onToggleFavorite, extraProducts = [] }) {

  // Statische Produkte (Fest im Code definiert)
  const staticProducts = [
    { 
      id: "sew_1", 
      name: "Kuchentaschen", 
      price: 40.00, 
      image: img04, 
      images: [img04, img06, img07], 
      desc: "Handgefertigte Kuchentasche für den sicheren Transport Ihrer Backwerke." 
    },
    { 
      id: "sew_2", 
      name: "Schüsselhauben", 
      price: 24.00, 
      image: img12, 
      images: [img12, img14, img15], 
      desc: "Wiederverwendbare Abdeckhauben als ökologische Alternative zur Alufolie." 
    },
    { 
      id: "sew_3", 
      name: "Küchenhandtuch", 
      price: 18.00, 
      image: img20, 
      images: [img20, img21, img22], 
      desc: "Praktisches und dekoratives Handtuch für Ihre Küche." 
    },
    { 
      id: "sew_4", 
      name: "Latzschürze", 
      price: 49.00, 
      image: img23, 
      images: [img23], 
      desc: "Elegante Schürze aus hochwertigem Stoff für die Arbeit im Atelier oder der Küche." 
    }
  ];

  // Dynamische Produkte aus Firebase vorbereiten
  const firebaseItems = extraProducts.map(p => ({
    ...p,
    id: p.id,
    image: p.imageUrl, // Mapping für die ProductCard
    desc: p.description || ""
  }));

  // Alle Produkte kombinieren
  const allProducts = [...staticProducts, ...firebaseItems];

  // Suchfilter anwenden
  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.desc && p.desc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (searchTerm && filteredProducts.length === 0) return null;

  return (
    <section className="product-section">
      <div className="product-grid">
        {filteredProducts.map(p => {
          // Check, ob das Produkt in den Favoriten ist
          const isFavorite = favorites && favorites.some(fav => String(fav.id) === String(p.id));

          // Einheitliches Datenobjekt für Funktionen (Details & Favoriten)
          const productData = {
            id: p.id,
            name: p.name,
            title: p.name, // Fallback für Komponenten, die .title nutzen
            price: p.price,
            description: p.desc || p.description,
            image: p.image,
            imageUrl: p.image,
            images: p.images || [p.image], // Falls keine Galerie vorhanden, Hauptbild nutzen
            category: 'Sewing'
          };

          return (
            <ProductCard 
              key={p.id}
              image={p.image}
              name={p.name}
              price={typeof p.price === 'number' ? p.price.toFixed(2) : p.price}
              onAdd={onAdd}
              isFavorite={isFavorite}
              onToggleFavorite={() => onToggleFavorite(productData)}
              onClick={() => onSelectProduct(productData)}
            />
          );
        })}
      </div>
    </section>
  );
}

export default SectionSewing;