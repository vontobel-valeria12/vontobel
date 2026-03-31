import React from "react";
import ProductCard from './ProductCard'; 

// Asset-Importe
import imgBaa from '../assets/BAA10-AH-_web_01.jpg';
import imgaventais from '../assets/avental.jpg';
import imgmug from '../assets/mug.png';
import imgmoedeiro from '../assets/moedeiro.jpg';
import imgSchlüsselanhänger from '../assets/chaveiromercadoficha.jpg';
import igmtray from '../assets/mini.jpg';
import Losmetiklaschen from '../assets/Losmetiklaschen.jpg';
import Tasche from '../assets/tasche.jpg';
import Body from '../assets/body.jpg';
import Garraf from '../assets/garafa.jpg';
import imgbox from '../assets/madeira.jpg';
import imgcarteira from '../assets/carteira.jpg';
import imgmochila from '../assets/bolsa.jpeg';

function SectionPersonalized({ onAdd, onSelectProduct, searchTerm, favorites, onToggleFavorite, extraProducts = [] }) {

  // Statische Produkte (fest im Code)
  const staticProducts = [
    { id: 'pers_1', name: "Unisex Basic T-Shirt", image: imgBaa, price: 35.00, desc: "Individuell bedruckbar nach Ihren Wünschen." },
    { id: 'pers_2', name: "Mini T-SHIRT", image: igmtray, price: 15.00, desc: "Süsses Mini T-Shirt für Dekoration oder Geschenke." },
    { id: 'pers_3', name: "Latzschürze Klassik", image: imgaventais, price: 45.00, desc: "Personalisierbar mit Ihrem Design." },
    { id: 'pers_4', name: "Keramiktasse", image: imgmug, price: 25.00, desc: "Klassische weisse Tasse, individuell gestaltbar." },
    { id: 'pers_5', name: "Geldbörse", image: imgmoedeiro, price: 20.00, desc: "Kompakt und individuell gestaltbar." },
    { id: 'pers_6', name: "Schlüsselanhänger", image: imgSchlüsselanhänger, price: 12.00, desc: "Inklusive Einkaufswagenchip." },
    { id: 'pers_7', name: "Kosmetik Taschen", image: Losmetiklaschen, price: 28.00, desc: "Personalisierbar mit Ihrem Design." },
    { id: 'pers_8', name: "Täsche mit Necessaire", image: Tasche, price: 65.00, desc: "Set aus Tasche und passender Kosmetiktasche." },
    { id: 'pers_9', name: "Bodykleidung", image: Body, price: 22.00, desc: "Individuelle Baby-Bodys aus weichem Stoff." },
    { id: 'pers_10', name: "Flasche", image: Garraf, price: 30.00, desc: "Personalisierte Trinkflaschen." },
    { id: 'pers_11', name: "Weinkiste", image: imgbox, price: 40.00, desc: "Weinkiste aus naturfarbenem Kieferholz." },
    { id: 'pers_12', name: "Necessaire", image: imgcarteira, price: 24.00, desc: "Personalisierbar mit Ihrem Design." },
    { id: 'pers_13', name: "Turnbeutel", image: imgmochila, price: 18.00, desc: "Gestalten Sie Ihre eigene Sporttasche." },
  ];

  // Kombiniere statische Produkte mit den dynamischen Produkten aus Firebase
  // Wichtig: Wir stellen sicher, dass Firebase-Produkte das Feld 'image' nutzen
  const firebaseItems = extraProducts.map(p => ({
    ...p,
    image: p.imageUrl, // Firebase nutzt imageUrl, die Karte erwartet oft image
    desc: p.description || ""
  }));

  const allProducts = [...staticProducts, ...firebaseItems];

  // Filterung anwenden
  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.desc && p.desc.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Wenn gesucht wird und nichts gefunden wurde, zeigen wir nichts an
  if (searchTerm && filteredProducts.length === 0) return null;

  return (
    <section className="product-section">
      <div className="product-grid">
        {filteredProducts.map(p => {
          const isFavorite = favorites && favorites.some(fav => String(fav.id) === String(p.id));

          // Einheitliches Objekt für Favoriten und Klicks erstellen
          const productData = {
            id: p.id,
            name: p.name,
            title: p.name,
            price: p.price,
            description: p.desc || p.description,
            image: p.image,
            imageUrl: p.image,
            category: 'Personalized'
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

export default SectionPersonalized;