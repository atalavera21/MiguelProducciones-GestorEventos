'use client';

import { useAuth } from '../../context/AuthContext';
import type { RolUsuario } from '../../types';

interface RolGuardProps {
  roles: RolUsuario[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RolGuard({ roles, children, fallback }: RolGuardProps) {
  const { usuario, isLoading } = useAuth();

  if (isLoading) return null;

  if (!usuario || !roles.includes(usuario.rol)) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <p className="text-text-secondary text-sm">
        No tienes permiso para acceder a esta sección.
      </p>
    );
  }

  return <>{children}</>;
}

export function useEsViewer(): boolean {
  const { usuario } = useAuth();
  return usuario?.rol === 'VIEWER';
}
