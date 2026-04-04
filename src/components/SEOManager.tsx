import React, { useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const SEOManager: React.FC = () => {
  useEffect(() => {
    const docRef = doc(db, 'settings', 'general');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const allowIndexing = data.allowIndexing !== false; // Default to true if undefined
        
        let metaRobots = document.querySelector('meta[name="robots"]');
        
        if (!metaRobots) {
          metaRobots = document.createElement('meta');
          metaRobots.setAttribute('name', 'robots');
          document.head.appendChild(metaRobots);
        }
        
        if (allowIndexing) {
          metaRobots.setAttribute('content', 'index, follow');
        } else {
          metaRobots.setAttribute('content', 'noindex, nofollow');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};
