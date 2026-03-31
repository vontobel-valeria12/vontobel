import { 
  db 
} from "./firebaseConfig"; 
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  query, 
  serverTimestamp 
} from "firebase/firestore";

export const addFavorite = async (userId, item) => {
  try {
    const favRef = doc(db, "users", userId, "favorites", item.id.toString());
    
    // Wir speichern ALLES (...item), nicht nur einzelne Felder
    // Und wir stellen sicher, dass imageUrl einheitlich ist
    await setDoc(favRef, {
      ...item,
      id: item.id.toString(), // ID als String sichern
      imageUrl: item.image || item.imageUrl || "", // Fallback für Bilder
      addedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error);
    throw error;
  }
};

/**
 * Remove um item dos favoritos do usuário
 */
export const removeFavorite = async (userId, itemId) => {
  try {
    const favRef = doc(db, "users", userId, "favorites", itemId.toString());
    await deleteDoc(favRef);
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    throw error;
  }
};

/**
 * Escuta os favoritos em tempo real (para o App.js ou Header.js)
 */
export const subscribeToFavorites = (userId, callback) => {
  const favCollection = collection(db, "users", userId, "favorites");
  const q = query(favCollection);

  return onSnapshot(q, (snapshot) => {
    const favorites = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(favorites);
  });
};