import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { subscribeToFavorites, addFavorite, removeFavorite } from '../firebase/firestore'; 
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import '../styles/style.css';

// Daten
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
import Anmeldung from './Anmeldung';
import Registrierung from './Registrierung';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

function AppContent() {
  const { currentUser, logout } = useAuth(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPersonalized, setSelectedPersonalized] = useState(null); 
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [favorites, setFavorites] = useState([]);
  const [firebaseProducts, setFirebaseProducts] = useState([]); 
  const [loading, setLoading] = useState(true); // Korrektur 5: Ladezustand
  const [showLogin, setShowLogin] = useState(false); // Korrektur 2: Auth-Sichtbarkeit
  const [isLoginView, setIsLoginView] = useState(true);
  const [view, setView] = useState('shop');

  // Korrektur 1: Admin-Logik (Prüfung via E-Mail oder Custom Claim)
  const isAdmin = currentUser && currentUser.email === 'admin@deineseite.ch'; 

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

  // Korrektur 4: Firebase Produkte laden
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFirebaseProducts(prods);
      setLoading(false); // Daten geladen
    }, (error) => {
      console.error("Firestore Fehler:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Favoriten Logik
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
    const finalItem = foundProduct || foundService || item;

    if (finalItem.category === 'Personalized') {
      setSelectedPersonalized(finalItem);
    } else if (finalItem.category === 'Repairs') {
      setSelectedService(finalItem);
    } else {
      setSelectedProduct(finalItem);
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
      console.error("Fehler bei Favoriten:", error);
    }
  };

  const isDetailView = selectedProduct || selectedService || selectedPersonalized;

  if (loading) return <div className="loading-screen">Wird geladen...</div>;

  return (
    <div className="App">
      <Header
        favoritesCount={favorites.length}
        onGoHome={handleGoHome}
        onSearch={setSearchTerm}
        onShowLogin={() => {
          if (currentUser) {
            // Korrektur 1: Wenn Admin, dann zum AdminDashboard, sonst UserDashboard
            setView(isAdmin ? 'admin' : 'dashboard');
          } else {
            setShowLogin(true);
            setIsLoginView(true);
          }
        }}
      />

      {/* Korrektur 2: Auth-Modals Rendering */}
      {showLogin && !currentUser && (
        <div className="auth-modal-overlay">
          <div className="auth-modal-content">
            <button className="close-btn" onClick={() => setShowLogin(false)}>×</button>
            {isLoginView ? (
              <Anmeldung onSwitch={() => setIsLoginView(false)} />
            ) : (
              <Registrierung onSwitch={() => setIsLoginView(true)} />
            )}
          </div>
        </div>
      )}

      {view === 'shop' && !isDetailView && (
        <div className="categorias-banner">
          <Categories onSelectCategory={setActiveCategory} />
        </div>
      )}

      <main>
        {/* Korrektur 1: Admin View */}
        {view === 'admin' && isAdmin ? (
          <AdminDashboard onBack={() => setView('shop')} />
        ) : view === 'dashboard' && currentUser ? (
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
                    firebaseProducts={firebaseProducts} // Korrektur 4
                  />
                )}
                {(activeCategory === 'All' || activeCategory === 'Sewing') && (
                  <SectionSewing 
                    onSelectProduct={setSelectedProduct} 
                    searchTerm={searchTerm}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    firebaseProducts={firebaseProducts}
                  />
                )}
                {(activeCategory === 'All' || activeCategory === 'Personalized') && (
                  <SectionPersonalized
                    onSelectProduct={setSelectedPersonalized} 
                    searchTerm={searchTerm}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    firebaseProducts={firebaseProducts}
                  />
                )}
              </>
            ) : (
              <div className="detail-container">
                {selectedProduct && (
                  <ProductDetail
                    product={selectedProduct}
                    onBack={() => setSelectedProduct(null)}
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

      <a href="https://wa.me/41765019056" className="whatsapp" target="_blank" rel="noreferrer">💬</a>
      
      <footer>
        <p>© 2026 kreativ Näharbeiten - Valéria Vontobel | Ihr Schneideratelier</p>
      </footer>
    </div>
  );
}

export default AppContent;