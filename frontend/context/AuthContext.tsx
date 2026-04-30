'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../lib/api/client';
import type { Usuario, RolUsuario } from '../types';

interface AuthContextValue {
  usuario: Usuario | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  puedeEditar: boolean;
  login: (alias: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function guardarToken(token: string): void {
  localStorage.setItem('token', token);
  // También en cookie para que el middleware de Next.js pueda leerlo
  document.cookie = `token=${token}; path=/; SameSite=Strict; max-age=${8 * 60 * 60}`;
}

function limpiarToken(): void {
  localStorage.removeItem('token');
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const restaurarSesion = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const perfil = await apiClient.get<Usuario>('/auth/me');
      setUsuario(perfil);
    } catch {
      // Token inválido o expirado — limpiar
      limpiarToken();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restaurarSesion();
  }, [restaurarSesion]);

  const login = async (alias: string, password: string): Promise<void> => {
    const resultado = await apiClient.post<{ token: string; usuario: Usuario }>(
      '/auth/login',
      { alias, password }
    );
    guardarToken(resultado.token);
    setUsuario(resultado.usuario);
    router.push('/agenda');
  };

  const logout = (): void => {
    limpiarToken();
    setUsuario(null);
    router.push('/login');
  };

  const puedeEditar = usuario?.rol === 'ADMIN' || usuario?.rol === 'DUENO';

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isLoading,
        isAuthenticated: usuario !== null,
        puedeEditar,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
