import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    // Redireciona para login mas salva de onde o usuário veio
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    // Se for apenas para admin e o usuário não for, manda para home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
