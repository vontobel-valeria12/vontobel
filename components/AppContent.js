import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { subscribeToFavorites, addFavorite, removeFavorite } from '../firebase/firestore';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import '../styles/style.css'; 

import { ALL_PRODUCTS, ALL_SERVICES } from '../data/productsData';

// Komponenten
import Header from './Header';
import Categories from './Categories';
import SectionRepairs from './SectionRepairs';
import SectionSewing from './SectionSewing';
import SectionPersonalized from './SectionPersonalized';
import ProductDetail from './ProductDetail';
import ServiceDetail from './ServiceDetail';
import ProductDetailPersonalized from './ProductDetailPersonalized'; 
import UserDashboard from './UserDashboard';

function AppContent() {
  const { currentUser, logout } = useAuth(); 
  
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPersonalized, setSelectedPersonalized] = useState(null); 
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [favorites, setFavorites] = useState([]);
  const [firebaseProducts, setFirebaseProducts] = useState([]); // State für dynamische Produkte
  const [showLogin, setShowLogin] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [view, setView] = useState('shop');

  const addToCart = () => setCartCount(prev => prev + 1);

  const handleGoHome = () => {
    setSelectedProduct(null);
    setSelectedService(null);
    setSelectedPersonalized(null);
    setActiveCategory('All');
    setSearchTerm("");
    setView('shop');
  };

  const handleLogout = async () => {
    try {
      await logout();
      setView('shop');
      setShowLogin(false);
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
    }
  };

  // --- NEU: Produkte aus Firebase Firestore laden ---
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFirebaseProducts(prods);
    });
    return () => unsubscribe();
  }, []);

  // --- Favoriten Logik ---
  useEffect(() => {
    let unsubscribe;
    if (currentUser) {
      unsubscribe = subscribeToFavorites(currentUser.uid, (favList) => {
        setFavorites(favList);
      });
    } else {
      setFavorites([]);
    }
    return () => { if (unsubscribe) unsubscribe(); };
  }, [currentUser]);

  const handleSelectProductFromDashboard = (item) => {
    setView('shop'); 
    const foundProduct = ALL_PRODUCTS.find(p => String(p.id) === String(item.id));
    const foundService = ALL_SERVICES.find(s => String(s.id) === String(item.id));
    
    // Falls das Produkt weder in statischen Produkten noch Services ist, ist es aus Firebase
    const finalItem = foundProduct || foundService || item;

    if (finalItem.category === 'Personalized') {
      setSelectedPersonalized(finalItem);
      setSelectedProduct(null);
      setSelectedService(null);
    } else if (finalItem.category === 'Repairs') {
      setSelectedService(finalItem);
      setSelectedProduct(null);
      setSelectedPersonalized(null);
    } else {
      setSelectedProduct(finalItem);
      setSelectedPersonalized(null);
      setSelectedService(null);
    }
  };

  const toggleFavorite = async (item) => {
    if (!currentUser) {
      setShowLogin(true);
      return;
    }
    const isFav = favorites.find(fav => fav.id === item.id.toString());
    try {
      if (isFav) {
        await removeFavorite(currentUser.uid, item.id);
      } else {
        await addFavorite(currentUser.uid, item);
      }
    } catch (error) {
      console.error("Fehler beim Favoriten-Update:", error);
    }
  };

  const isDetailView = selectedProduct || selectedService || selectedPersonalized;

  return (
    <div className="App">
      <Header
        cartCount={cartCount}
        favoritesCount={favorites.length}
        onGoHome={handleGoHome}
        onSearch={setSearchTerm}
        onShowLogin={() => {
          if (currentUser) setView('dashboard');
          else { setShowLogin(true); setIsLoginView(true); }
        }}
      />

      {view === 'shop' && !isDetailView && (
        <div className="categorias-banner">
          <Categories onSelectCategory={setActiveCategory} />
        </div>
      )}

      <main>
        {view === 'dashboard' && currentUser ? (
          <UserDashboard
            user={currentUser}
            onBack={() => setView('shop')}
            onLogout={handleLogout}
            favorites={favorites}
            onSelectProduct={handleSelectProductFromDashboard} 
          />
        ) : (
          <div className="shop-content">
            {!isDetailView ? (
              <>
                {(activeCategory === 'All' || activeCategory === 'Repairs') && (
                  <SectionRepairs 
                    onSelectService={setSelectedService} 
                    searchTerm={searchTerm}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    extraServices={firebaseProducts.filter(p => p.category === 'Repairs')}
                  />
                )}
                {(activeCategory === 'All' || activeCategory === 'Sewing') && (
                  <SectionSewing 
                    onAdd={addToCart} 
                    onSelectProduct={setSelectedProduct} 
                    searchTerm={searchTerm}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    extraProducts={firebaseProducts.filter(p => p.category === 'Sewing')}
                  />
                )}
                {(activeCategory === 'All' || activeCategory === 'Personalized') && (
                  <SectionPersonalized
                    onSelectProduct={setSelectedPersonalized} 
                    searchTerm={searchTerm}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    extraProducts={firebaseProducts.filter(p => p.category === 'Personalized')}
                  />
                )}
              </>
            ) : (
              <div className="detail-container">
                {selectedProduct && (
                  <ProductDetail
                    product={selectedProduct}
                    onBack={() => setSelectedProduct(null)}
                    onAdd={addToCart}
                  />
                )}
                {selectedService && (
                  <ServiceDetail
                    service={selectedService}
                    onBack={() => setSelectedService(null)}
                  />
                )}
                {selectedPersonalized && (
                  <ProductDetailPersonalized
                    product={selectedPersonalized}
                    onBack={() => setSelectedPersonalized(null)} 
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <a href="https://wa.me/41765019056" className="whatsapp" target="_blank" rel="noreferrer" aria-label="WhatsApp Kontakt">💬</a>
      
      <footer>
        <p>© 2026 kreativ Näharbeiten - Valéria Vontobel | Ihr Schneideratelier</p>
      </footer>
    </div>
  );
}

export default AppContent;