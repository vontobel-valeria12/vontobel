import { db, storage } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Lädt ein Bild hoch und erstellt ein neues Produkt im Katalog
 */
export const addProductToKatalog = async (productData, imageFile) => {
  try {
    // 1. Pfad im Storage definieren (z.B. katalog/171123456_meinbild.jpg)
    const storageRef = ref(storage, `katalog/${Date.now()}_${imageFile.name}`);

    // 2. Datei hochladen
    const snapshot = await uploadBytes(storageRef, imageFile);

    // 3. Die öffentliche URL abrufen
    const downloadURL = await getDownloadURL(snapshot.ref);

    // 4. Dokument in Firestore erstellen
    const docRef = await addDoc(collection(db, "products"), {
      name: productData.name,
      description: productData.description,
      category: productData.category,
      price: Number(productData.price), 
      imageUrl: downloadURL,            
      createdAt: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Produkts:", error);
    throw error;
  }
};