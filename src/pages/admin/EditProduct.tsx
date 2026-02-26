import React from 'react';
import { useParams } from 'react-router-dom';
import { ProductForm } from '../../components/admin/ProductForm';

export const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  return <ProductForm productId={id} isEdit />;
};
