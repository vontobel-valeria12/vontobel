import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { removeFavorite } from '../firebase/firestore';

// UserDashboard.jsx - KORRIGIERTE FAVORITESLIST

const FavoritesList = ({ favorites, userId, onSelectProduct }) => (
  <section className="dash-section view-fade-in">
    <h2><span className="icon">❤️</span> Meine Wunschliste</h2>
    {favorites.length === 0 ? (
      <p className="empty-msg">Sie haben noch keine Favoriten gespeichert.</p>
    ) : (
      <div className="favorites-grid-dash">
        {favorites.map((fav) => (
          <div key={fav.id} className="fav-card-dash">
            <img 
              // Wichtig: Prüfe beide Bild-Quellen
              src={fav.image || fav.imageUrl} 
              alt={fav.title} 
              className="fav-img-dash" 
              onClick={() => onSelectProduct(fav)} 
              style={{ cursor: 'pointer' }}
            />
            <div className="fav-info-dash">
              <p className="fav-title">{fav.title}</p>
              <small className="fav-price">{fav.price} CHF</small>
              <div className="fav-actions-dash">
                <button 
                  className="btn-buy-fav-direct" 
                  onClick={() => onSelectProduct(fav)}
                >
                  🛒 
                </button>
              </div>
              <button 
                className="btn-remove-link" 
                onClick={() => removeFavorite(userId, fav.id)}
              >
                Entfernen
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);
// --- COMPONENTES DE SERVIÇOS E ORDENS ---
const ServiceList = ({ services, isAdmin, onUpdateStatus }) => (
  <section className="dash-section">
    <h2><span className="icon">✂️</span> Aktuelle Services</h2>
    {services.length === 0 && <p className="empty-msg">Keine Services gefunden.</p>}
    {services.map((s) => (
      <div key={s.id} className={`order-card status-border-${s.statusClass || 'active'}`}>
        <div className="order-info">
          <p><strong>#{s.id.slice(0,5)}</strong> - {s.serviceName || s.produkt}</p>
          <small>Eingang: {s.datum || 'Neu'}</small>
          <br />
          <small><strong>Total: {s.total} CHF</strong></small>
        </div>
        {isAdmin ? (
          <select 
            className="status-select-admin"
            value={s.status} 
            onChange={(e) => onUpdateStatus(s.id, e.target.value)}
          >
            <option value="pendente">Pendente</option>
            <option value="In Arbeit">In Arbeit</option>
            <option value="Bereit">Bereit</option>
            <option value="Abgeschlossen">Abgeschlossen</option>
          </select>
        ) : (
          <span className={`status-badge ${s.statusClass || 'status-work'}`}>{s.status}</span>
        )}
      </div>
    ))}
  </section>
);

const ProductList = ({ orders }) => (
  <section className="dash-section">
    <h2><span className="icon">📦</span> Aktuelle Bestellungen</h2>
    {orders.length === 0 && <p className="empty-msg">Keine Bestellungen vorhanden.</p>}
    {orders.map((b) => (
      <div key={b.id} className="order-card status-border-active">
        <div className="order-info">
          <p><strong>#{b.id.slice(0,5)}</strong> - {b.produkt}</p>
          <small>Bestellt am: {b.datum}</small>
        </div>
        <span className="status-badge status-active">{b.status}</span>
      </div>
    ))}
  </section>
);

const HistoryList = ({ history }) => (
  <section className="dash-section">
    <h2><span className="icon">📜</span> Bestellverlauf</h2>
    {history.length === 0 && <p className="empty-msg">Noch keine abgeschlossenen Bestellungen.</p>}
    {history.map((h) => (
      <div key={h.id} className="order-card history-card">
        <div className="order-info">
          <p><strong>{h.id}</strong> - {h.produkt}</p>
          <small>Abgeschlossen am: {h.datum}</small>
        </div>
        <span className="status-badge status-archived">{h.status}</span>
      </div>
    ))}
  </section>
);

// --- SEÇÃO DE PERFIL ---
const ProfileSection = ({ initialProfile }) => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSave = async () => {
    if (!profile.plz.match(/^\d{4}$/)) {
      setMsg('❌ PLZ muss 4 Zahlen haben (Schweiz).');
      return;
    }
    setIsSaving(true);
    setMsg('');
    setTimeout(() => {
      setIsSaving(false);
      setEditMode(false);
      setMsg('✅ Profil erfolgreich gespeichert!');
      setTimeout(() => setMsg(''), 3000);
    }, 1000);
  };

  return (
    <section className="profile-section">
      <h2>👤 Mein Profil & Lieferadresse</h2>
      {msg && <p className="status-message">{msg}</p>}
      <div className="profile-card">
        {!editMode ? (
          <div className="profile-display">
            <p><strong>Name:</strong> {profile.vorname} {profile.nachname || '–'}</p>
            <p><strong>Adresse:</strong> {profile.strasse ? `${profile.strasse}, ${profile.plz} ${profile.ort}` : 'Keine Adresse'}</p>
            <p><strong>Telefon:</strong> {profile.telefon || '–'}</p>
            <button className="btn-repair" onClick={() => setEditMode(true)}>Bearbeiten</button>
          </div>
        ) : (
          <div className="profile-form">
            <div className="form-row">
              <input type="text" placeholder="Vorname" value={profile.vorname} onChange={(e) => setProfile({...profile, vorname: e.target.value})} />
              <input type="text" placeholder="Nachname" value={profile.nachname} onChange={(e) => setProfile({...profile, nachname: e.target.value})} />
            </div>
            <input type="text" placeholder="Strasse / Nr." className="full-width" value={profile.strasse} onChange={(e) => setProfile({...profile, strasse: e.target.value})} />
            <div className="form-row-geo">
              <input type="text" placeholder="PLZ" value={profile.plz} onChange={(e) => setProfile({...profile, plz: e.target.value})} />
              <input type="text" placeholder="Ort" value={profile.ort} onChange={(e) => setProfile({...profile, ort: e.target.value})} />
            </div>
            <input type="text" placeholder="Telefon" className="full-width" value={profile.telefon} onChange={(e) => setProfile({...profile, telefon: e.target.value})} />
            <div className="form-actions">
              <button className="btn-save" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Speichert...' : 'Speichern'}</button>
              <button className="btn-back" onClick={() => setEditMode(false)}>Abbrechen</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// --- COMPONENTE PRINCIPAL ---
const UserDashboard = ({ user, onBack, onLogout, favorites, onAdd, onSelectProduct }) => {
  const [activeTab, setActiveTab] = useState('Übersicht');
  const [meineServices, setMeineServices] = useState([]);
  
  const isAdmin = user?.email === "admin@seu-atelier.ch";

  const tabs = [
    { id: 'Übersicht', icon: '📊' },
    { id: 'Favoriten', icon: '❤️' },
    { id: 'Services', icon: '👗' },
    { id: 'Bestellungen', icon: '🛍️' },
    { id: 'History', icon: '📜' },
    { id: 'Profil', icon: '👤' }
  ];

  useEffect(() => {
    if (!user?.uid) return;

    const q = isAdmin 
      ? collection(db, "orders") 
      : query(collection(db, "orders"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMeineServices(ordersData);
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-user-info">
          <button onClick={onBack} className="btn-back-arrow">←</button>
          <div>
            <h1>Mein Konto {isAdmin && "(Admin)"}</h1>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>
        <button onClick={onLogout} className="btn-logout">Abmelden</button>
      </header>

      <div className="dashboard-grid">
        <nav className="dash-menu">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              className={`menu-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="menu-icon">{tab.icon}</span>
              <span className="menu-text">{tab.id}</span>
            </button>
          ))}
        </nav>

        <main className="dash-content">
          {activeTab === 'Übersicht' && (
            <div className="view-fade-in">
              {/* Mostra um resumo dos favoritos logo na entrada */}
              <FavoritesList 
                favorites={favorites} 
                userId={user?.uid} 
                onAddToCart={onAdd}
                onSelectProduct={onSelectProduct}
              />
              <ServiceList 
                services={meineServices} 
                isAdmin={isAdmin} 
                onUpdateStatus={handleUpdateStatus} 
              />
            </div>
          )}
          
          {activeTab === 'Favoriten' && (
            <FavoritesList 
              favorites={favorites} 
              userId={user?.uid} 
              onAddToCart={onAdd}
              onSelectProduct={onSelectProduct}
            />
          )}

          {activeTab === 'Services' && (
            <ServiceList 
              services={meineServices} 
              isAdmin={isAdmin} 
              onUpdateStatus={handleUpdateStatus} 
            />
          )}
          
          {activeTab === 'Bestellungen' && <ProductList orders={[]} />}
          {activeTab === 'History' && <HistoryList history={[]} />}
          {activeTab === 'Profil' && <ProfileSection initialProfile={{vorname: 'Valéria', plz: '8000', ort: 'Zürich'}} />}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;