// src/data/productsData.js

export const ALL_PRODUCTS = [
  {
    id: 1,
    title: "Elegante Stofftasche",
    price: 45,
    category: "Sewing",
    description: "Handgefertigte Tasche aus hochwertigem Schweizer Leinen. Ideal für den täglichen Einkauf oder als modisches Accessoire.",
    images: ["/images/tasche1.jpg", "/images/tasche1-detail.jpg", "/images/tasche1-innen.jpg"],
    image: "/images/tasche1.jpg" // Hauptbild
  },
  {
    id: 2,
    title: "Personalisierte Tasse",
    price: 25,
    category: "Personalized",
    description: "Gestalten Sie Ihre eigene Tasse mit unserem 3D-Konfigurator.",
    images: ["/images/tasse.jpg"],
    image: "/images/tasse.jpg"
  },
  // Füge hier deine anderen 2 Produkte hinzu...
];

export const ALL_SERVICES = [
  {
    id: 101,
    title: "Hosen kürzen",
    price: 15,
    category: "Repairs",
    description: "Professionelles Kürzen Ihrer Lieblingshosen innerhalb von 24 Stunden.",
    image: "/images/repair-service.jpg"
  }
];