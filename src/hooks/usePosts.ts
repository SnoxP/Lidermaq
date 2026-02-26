import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { BLOG_POSTS } from '../data/mockData';

export const usePosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        setPosts(BLOG_POSTS);
      } else {
        const postList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postList);
      }
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar posts em tempo real:", error);
      setPosts(BLOG_POSTS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { posts, loading };
};
