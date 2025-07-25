// src/components/PublicRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
type Props = {
  children: React.ReactNode;
};

export default function PublicRoute({ children }: Props) {
  const isAuthenticated = localStorage.getItem('email');
  return isAuthenticated ? <Navigate to="/home" replace /> : <>{children}</>;
}
