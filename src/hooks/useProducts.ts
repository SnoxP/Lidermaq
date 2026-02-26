import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { PRODUCTS } from '../data/mockData';

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        setProducts(PRODUCTS);
      } else {
        const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productList);
      }
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar produtos em tempo real:", error);
      setProducts(PRODUCTS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { products, loading };
};
