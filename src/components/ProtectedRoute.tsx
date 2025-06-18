import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '@/lib/context';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    // Redirecionar para login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
} 