import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
let storage: any;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined") {
    console.log("Iniciando Firebase com o projeto:", firebaseConfig.projectId);
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

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
    console.error("ERRO CRÍTICO: Chave de API do Firebase não encontrada no .env");
  }
} catch (error) {
  console.error("Falha na inicialização do Firebase:", error);
}

export { auth, db, storage };
