'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { CalendarioMensual } from '@/components/agenda/CalendarioMensual';
import { ListaEventos } from '@/components/agenda/ListaEventos';
import { RolGuard } from '@/components/auth/RolGuard';
import type { EventoResumen } from '@/types';

type Vista = 'calendario' | 'lista';

export default function AgendaPage() {
  const [eventos,  setEventos]  = useState<EventoResumen[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [vista,    setVista]    = useState<Vista>('calendario');

  useEffect(() => {
    apiClient.get<EventoResumen[]>('/eventos')
      .then(setEventos)
      .catch(() => setError('No se pudo cargar la agenda'))
      .finally(() => setLoading(false));
  }, []);

  const totalLabel = loading
    ? 'Cargando...'
    : `${eventos.length} evento${eventos.length !== 1 ? 's' : ''} activo${eventos.length !== 1 ? 's' : ''}`;

  return (
    <div className="space-y-5">
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-text-primary font-bold text-xl">Agenda</h1>
          <p className="text-text-secondary text-sm mt-0.5">{totalLabel}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle de vista */}
          <div className="flex bg-bg-elevated border border-border rounded-md p-0.5">
            <button
              onClick={() => setVista('calendario')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                vista === 'calendario'
                  ? 'bg-bg-surface text-text-primary font-medium shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Calendario
            </button>
            <button
              onClick={() => setVista('lista')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                vista === 'lista'
                  ? 'bg-bg-surface text-text-primary font-medium shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Lista
            </button>
          </div>

          <RolGuard roles={['ADMIN', 'DUENO']}>
            <Link
              href="/agenda/nuevo"
              className="bg-primary hover:bg-primary-hover text-bg-base font-medium text-sm px-4 py-2 rounded-md transition-colors whitespace-nowrap"
            >
              + Nuevo Evento
            </Link>
          </RolGuard>
        </div>
      </div>

      {/* Cargando */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-danger/10 border border-danger/20 rounded-md px-4 py-3 text-danger text-sm">
          {error}
        </div>
      )}

      {/* Contenido */}
      {!loading && !error && (
        vista === 'calendario'
          ? <CalendarioMensual eventos={eventos} />
          : <ListaEventos eventos={eventos} />
      )}
    </div>
  );
}
