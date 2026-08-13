import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, setDoc, increment, getDoc } from 'firebase/firestore';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const statsRef = doc(db, 'settings', 'stats');
  try {
    const statsSnap = await getDoc(statsRef);
    if (statsSnap.exists()) {
      console.log("Stats exists:", statsSnap.data());
      await updateDoc(statsRef, {
        totalViews: increment(1)
      });
      console.log("Updated!");
    } else {
      console.log("Stats not found, creating.");
      await setDoc(statsRef, { totalViews: 1 });
      console.log("Created!");
    }
  } catch (error) {
    console.error("Erro ao incrementar visualizações:", error);
  }
  process.exit(0);
}
run();
