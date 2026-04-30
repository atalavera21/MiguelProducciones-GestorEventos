'use client';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import type { TipoEvento, TipoServicio } from '@/types';

export function useCatalogos() {
  const [tiposEvento, setTiposEvento] = useState<TipoEvento[]>([]);
  const [tiposServicio, setTiposServicio] = useState<TipoServicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get<TipoEvento[]>('/catalogos/tipos-evento'),
      apiClient.get<TipoServicio[]>('/catalogos/tipos-servicio'),
    ])
      .then(([eventos, servicios]) => {
        setTiposEvento(eventos);
        setTiposServicio(servicios);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { tiposEvento, tiposServicio, loading };
}
