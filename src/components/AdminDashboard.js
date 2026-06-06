import React, { useState } from 'react';
import { db, storage } from '../firebase/firebaseConfig'; // Pfad anpassen!
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AdminDashboard = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personalized'); // Standardkategorie
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // Neu: Status für den Upload

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!image) {
      alert("Bitte wähle ein Bild für das Design aus.");
      return;
    }

    setLoading(true); // Button deaktivieren während des Uploads

    try {
      // 1. Bild in Firebase Storage hochladen
      // Wir erstellen einen eindeutigen Namen mit Zeitstempel
      const storageRef = ref(storage, `katalog/${Date.now()}_${image.name}`);
      const snapshot = await uploadBytes(storageRef, image);
      
      // 2. Die URL des hochgeladenen Bildes abrufen
      const imageUrl = await getDownloadURL(snapshot.ref);

      // 3. Produktdaten in Firestore speichern
      const newProduct = {
        name: productName,
        description: description,
        category: category,
        price: parseFloat(price) || 0, // Preis als Zahl speichern
        imageUrl: imageUrl,            // Der Link zum Bild
        createdAt: serverTimestamp()    // Für die Sortierung
      };

      await addDoc(collection(db, "products"), newProduct);

      alert(`Erfolgreich! "${productName}" ist jetzt im Katalog.`);
      
      // Formular zurücksetzen
      setProductName('');
      setDescription('');
      setPrice('');
      setImage(null);
      // Den Input für das File manuell leeren (optional)
      e.target.reset();

    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Hoppla! Da gab es ein Problem beim Hochladen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', background: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#8b6f48', textAlign: 'center', marginBottom: '10px' }}>Katalog-Verwaltung</h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '30px' }}>
        Neue Designs für Tassen, Schlüsselanhänger und Näharbeiten hinzufügen.
      </p>
      
      <form onSubmit={handleUpload}>
        {/* Produktname */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Produktname</label>
          <input 
            type="text" 
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} 
            placeholder="z.B. Personalisierte Fototasse"
            required
          />
        </div>

        {/* Kategorie - WICHTIG: Muss mit deinen Filtern in AppContent übereinstimmen */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Kategorie</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
          >
            <option value="Personalized">Personalisierte Geschenke (Tassen, etc.)</option>
            <option value="Repairs">Reparaturen (Änderungen)</option>
            <option value="Sewing">Näharbeiten (Neuanfertigungen)</option>
          </select>
        </div>

        {/* Beschreibung */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Beschreibung</label>
          <textarea 
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
            placeholder="Materialien, Farben, Details..."
          />
        </div>

        {/* Preis in CHF */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Basispreis (CHF)</label>
          <input 
            type="number" 
            step="0.05"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} 
            placeholder="25.00"
            required
          />
        </div>

        {/* Bild-Upload */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Design-Foto auswählen</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ marginTop: '5px' }} 
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '15px', 
            fontSize: '1rem', 
            backgroundColor: loading ? '#ccc' : '#8b6f48', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? "WIRD HOCHGELADEN..." : "ZUM KATALOG SPEICHERN"}
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;