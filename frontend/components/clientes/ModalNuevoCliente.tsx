'use client';
import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import type { Cliente, RangoEdad } from '@/types';

interface Props {
  onCreado: (cliente: Cliente) => void;
  onCerrar: () => void;
}

const RANGOS: { value: RangoEdad; label: string }[] = [
  { value: '18-30', label: '18-30 años' },
  { value: '30-45', label: '30-45 años' },
  { value: '45+',   label: '45+ años' },
];

const INPUT_CLS = 'w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LABEL_CLS = 'block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5';

export function ModalNuevoCliente({ onCreado, onCerrar }: Props) {
  const [form, setForm] = useState({
    nombre:    '',
    telefono:  '',
    dni:       '',
    referencia: '',
    sexo:      'true',
    rangoEdad: '18-30' as RangoEdad,
  });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const set = (campo: string, valor: string) =>
    setForm(f => ({ ...f, [campo]: valor }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const cliente = await apiClient.post<Cliente>('/clientes', {
        nombre:     form.nombre.trim(),
        telefono:   form.telefono.trim(),
        dni:        form.dni.trim(),
        referencia: form.referencia.trim() || undefined,
        sexo:       form.sexo === 'true',
        rangoEdad:  form.rangoEdad,
      });
      onCreado(cliente);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el cliente');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCerrar} />
      <div className="relative bg-bg-surface border border-border rounded-lg shadow-modal w-full max-w-md p-6">
        {/* Cabecera */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-text-primary font-semibold text-base">Nuevo cliente</h2>
            <p className="text-text-secondary text-xs mt-0.5">Se creará y quedará seleccionado en el evento</p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="text-text-disabled hover:text-text-primary text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className={LABEL_CLS}>Nombre completo *</label>
            <input
              required
              value={form.nombre}
              onChange={e => set('nombre', e.target.value)}
              placeholder="Ej: María García López"
              className={INPUT_CLS}
            />
          </div>

          {/* Teléfono + DNI */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Teléfono *</label>
              <input
                required
                value={form.telefono}
                onChange={e => set('telefono', e.target.value)}
                placeholder="999 999 999"
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className={LABEL_CLS}>DNI *</label>
              <input
                required
                value={form.dni}
                onChange={e => set('dni', e.target.value)}
                placeholder="12345678"
                maxLength={12}
                className={INPUT_CLS}
              />
            </div>
          </div>

          {/* Referencia */}
          <div>
            <label className={LABEL_CLS}>Referencia</label>
            <input
              value={form.referencia}
              onChange={e => set('referencia', e.target.value)}
              placeholder="Ej: Facebook, referido por García"
              className={INPUT_CLS}
            />
          </div>

          {/* Sexo + Rango de edad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLS}>Sexo *</label>
              <div className="flex gap-4 mt-2.5">
                {[{ v: 'true', l: 'Masculino' }, { v: 'false', l: 'Femenino' }].map(opt => (
                  <label key={opt.v} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="sexo-modal"
                      value={opt.v}
                      checked={form.sexo === opt.v}
                      onChange={e => set('sexo', e.target.value)}
                      className="accent-primary"
                    />
                    <span className="text-text-primary text-sm">{opt.l}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className={LABEL_CLS}>Rango de edad *</label>
              <select
                value={form.rangoEdad}
                onChange={e => set('rangoEdad', e.target.value)}
                className={INPUT_CLS}
              >
                {RANGOS.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          {/* Acciones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 border border-border text-text-secondary hover:text-text-primary rounded-md py-2 text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-bg-base font-medium text-sm py-2 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              {enviando && (
                <span className="w-4 h-4 border-2 border-bg-base border-t-transparent rounded-full animate-spin" />
              )}
              {enviando ? 'Guardando...' : 'Crear cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
