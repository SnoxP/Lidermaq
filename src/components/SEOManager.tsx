import React, { useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const SEOManager: React.FC = () => {
  useEffect(() => {
    const docRef = doc(db, 'settings', 'general');
    
    const applyRobotsMeta = (allowIndexing: boolean) => {
      // 1. Meta robots geral
      let metaRobots = document.querySelector('meta[name="robots"]');
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }

      // 2. Meta googlebot específico
      let metaGooglebot = document.querySelector('meta[name="googlebot"]');
      if (!metaGooglebot) {
        metaGooglebot = document.createElement('meta');
        metaGooglebot.setAttribute('name', 'googlebot');
        document.head.appendChild(metaGooglebot);
      }
      
      if (allowIndexing) {
        metaRobots.setAttribute('content', 'index, follow, max-image-preview:large');
        metaGooglebot.setAttribute('content', 'index, follow');
      } else {
        metaRobots.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
        metaGooglebot.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');
      }

      // Sincroniza com o servidor Express (para /robots.txt e cabeçalhos X-Robots-Tag)
      fetch('/api/indexing-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allowIndexing })
      }).catch(() => {
        // Silencioso se estiver offline ou em ambiente estático
      });
    };

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const allow = data.allowIndexing !== false;
        applyRobotsMeta(allow);
      }
    }, () => {
      // Fallback para api se falhar o Firestore
      fetch('/api/indexing-status')
        .then(r => r.json())
        .then(d => applyRobotsMeta(d.allowIndexing !== false))
        .catch(() => {});
    });

    return () => unsubscribe();
  }, []);

  return null;
};
