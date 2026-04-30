'use client';
import { useState, useRef, useEffect } from 'react';
import type { Cliente } from '@/types';

interface Props {
  clientes: Cliente[];
  seleccionado: Cliente | null;
  onSelect: (cliente: Cliente) => void;
  onLimpiar: () => void;
  onCrearNuevo: () => void;
}

export function BuscadorCliente({ clientes, seleccionado, onSelect, onLimpiar, onCrearNuevo }: Props) {
  const [query, setQuery] = useState('');
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtrados = query.length >= 1
    ? clientes
        .filter(c =>
          c.nombre.toLowerCase().includes(query.toLowerCase()) ||
          c.dni.includes(query)
        )
        .slice(0, 8)
    : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (seleccionado) {
    return (
      <div className="flex items-center gap-2 bg-bg-elevated border border-primary/40 rounded-md px-3 py-2.5">
        <div className="flex-1 min-w-0">
          <p className="text-text-primary text-sm font-medium truncate">{seleccionado.nombre}</p>
          <p className="text-text-secondary text-xs mt-0.5">
            DNI {seleccionado.dni} · {seleccionado.telefono}
          </p>
        </div>
        <button
          type="button"
          onClick={onLimpiar}
          className="text-text-disabled hover:text-danger text-xl leading-none flex-shrink-0 transition-colors"
          title="Cambiar cliente"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setAbierto(true); }}
          onFocus={() => setAbierto(true)}
          placeholder="Buscar por nombre o DNI..."
          className="w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />

        {abierto && query.length >= 1 && (
          <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-bg-elevated border border-border rounded-md shadow-modal overflow-hidden max-h-56 overflow-y-auto">
            {filtrados.length > 0 ? (
              filtrados.map(c => (
                <li
                  key={c.id}
                  onMouseDown={() => { onSelect(c); setQuery(''); setAbierto(false); }}
                  className="px-3 py-2.5 cursor-pointer hover:bg-bg-surface flex items-center justify-between gap-4 border-b border-border-subtle last:border-0"
                >
                  <span className="text-text-primary text-sm truncate">{c.nombre}</span>
                  <span className="text-text-disabled text-xs flex-shrink-0">{c.dni}</span>
                </li>
              ))
            ) : (
              <li className="px-3 py-2.5 text-text-disabled text-sm">
                Sin coincidencias
              </li>
            )}
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={onCrearNuevo}
        title="Crear cliente nuevo"
        className="px-3 py-2 bg-primary-muted border border-primary/30 hover:bg-primary/20 text-primary rounded-md text-lg font-bold transition-colors flex-shrink-0"
      >
        +
      </button>
    </div>
  );
}
