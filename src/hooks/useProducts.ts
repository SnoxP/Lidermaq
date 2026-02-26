import { useProductContext } from '../contexts/ProductContext';

export const useProducts = () => {
  const { products, loading } = useProductContext();
  return { products, loading };
};
