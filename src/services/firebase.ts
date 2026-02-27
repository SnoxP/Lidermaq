import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: any;
let auth: any;
let db: any;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined") {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Habilita persistência offline para velocidade e uso sem rede
    if (typeof window !== "undefined") {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn("Persistência falhou: múltiplas abas abertas.");
        } else if (err.code === 'unimplemented') {
          console.warn("Persistência não suportada pelo navegador.");
        }
      });
    }
  } else {
    console.warn("Firebase API Key is missing. App will run in limited mode.");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { auth, db };
