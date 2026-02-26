import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { PRODUCTS } from '../data/mockData';

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          // Fallback para mock data se o banco estiver vazio
          setProducts(PRODUCTS);
        } else {
          const productList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProducts(productList);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos do Firestore:", error);
        setProducts(PRODUCTS); // Fallback em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};
