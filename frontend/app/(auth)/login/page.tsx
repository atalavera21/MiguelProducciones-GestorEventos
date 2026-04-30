'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/agenda');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await login(alias, password);
    } catch {
      setError('Alias o contraseña incorrectos');
    } finally {
      setEnviando(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="bg-bg-surface border border-border rounded-lg shadow-modal p-8 w-full max-w-sm">
        {/* Cabecera */}
        <div className="mb-8 text-center">
          <h1 className="text-primary font-bold text-xl">Miguel Producciones</h1>
          <p className="text-text-secondary text-sm mt-1">Sistema de gestión</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo alias */}
          <div>
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
              Usuario
            </label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Ej: adrian"
              autoComplete="username"
              required
              className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Campo contraseña */}
          <div>
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <p className="text-danger text-sm">{error}</p>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-bg-base font-medium text-sm px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            {enviando && (
              <span className="w-4 h-4 border-2 border-bg-base border-t-transparent rounded-full animate-spin" />
            )}
            {enviando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
