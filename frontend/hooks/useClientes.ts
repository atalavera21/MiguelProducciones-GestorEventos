'use client';
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import type { Cliente } from '@/types';

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    const data = await apiClient.get<Cliente[]>('/clientes');
    setClientes(data);
  }, []);

  useEffect(() => {
    cargar().catch(console.error).finally(() => setLoading(false));
  }, [cargar]);

  return { clientes, loading, recargar: cargar };
}
