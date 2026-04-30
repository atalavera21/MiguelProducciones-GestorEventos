'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { useCatalogos } from '@/hooks/useCatalogos';
import { useClientes } from '@/hooks/useClientes';
import { BuscadorCliente } from '@/components/clientes/BuscadorCliente';
import { ModalNuevoCliente } from '@/components/clientes/ModalNuevoCliente';
import type { Cliente, CrearEventoPayload, CrearServicioPayload, TipoPapel } from '@/types';

const INPUT_CLS = 'w-full bg-bg-elevated border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary';
const LABEL_CLS = 'block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5';
const SECTION_CLS = 'bg-bg-surface border border-border rounded-lg p-5 space-y-4';

interface FotografiaState {
  activo: boolean;
  precio: string;
  esDigital: boolean;
  esFisica: boolean;
  tipoPapel: TipoPapel | '';
  notas: string;
}

interface FilmacionState {
  activo: boolean;
  precio: string;
  incluyeHighlight: boolean;
  notas: string;
}

interface CuadroFirmaState {
  activo: boolean;
  precio: string;
  descripcion: string;
}

export default function NuevoEventoPage() {
  const router = useRouter();
  const { tiposEvento, loading: loadingCatalogos } = useCatalogos();
  const { clientes, loading: loadingClientes, recargar } = useClientes();

  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const [idTipoEvento, setIdTipoEvento] = useState('');
  const [fecha,        setFecha]        = useState('');
  const [hora,         setHora]         = useState('');
  const [direccion,    setDireccion]    = useState('');
  const [notas,        setNotas]        = useState('');

  const [fotografia, setFotografia] = useState<FotografiaState>({
    activo: false, precio: '', esDigital: true, esFisica: false, tipoPapel: '', notas: '',
  });
  const [filmacion, setFilmacion] = useState<FilmacionState>({
    activo: false, precio: '', incluyeHighlight: true, notas: '',
  });
  const [cuadroFirma, setCuadroFirma] = useState<CuadroFirmaState>({
    activo: false, precio: '', descripcion: '',
  });

  const [error,    setError]    = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleClienteCreado = async (cliente: Cliente) => {
    await recargar();
    setClienteSeleccionado(cliente);
    setModalAbierto(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!clienteSeleccionado) {
      setError('Debes seleccionar un cliente');
      return;
    }
    if (!fotografia.activo && !filmacion.activo && !cuadroFirma.activo) {
      setError('Debes agregar al menos un servicio');
      return;
    }

    const servicios: CrearServicioPayload[] = [];

    if (fotografia.activo) {
      servicios.push({
        idTipoServicio: 1,
        precio: parseFloat(fotografia.precio),
        detalleFotografia: {
          esDigital: fotografia.esDigital,
          esFisica:  fotografia.esFisica,
          tipoPapel: fotografia.esFisica && fotografia.tipoPapel ? fotografia.tipoPapel : null,
          notas:     fotografia.notas || null,
        },
      });
    }

    if (filmacion.activo) {
      servicios.push({
        idTipoServicio: 2,
        precio: parseFloat(filmacion.precio),
        detalleFilmacion: {
          incluyeHighlight: filmacion.incluyeHighlight,
          notas:            filmacion.notas || null,
        },
      });
    }

    if (cuadroFirma.activo) {
      servicios.push({
        idTipoServicio: 3,
        precio: parseFloat(cuadroFirma.precio),
        detalleCuadroFirma: {
          descripcion: cuadroFirma.descripcion,
        },
      });
    }

    const payload: CrearEventoPayload = {
      idCliente:    clienteSeleccionado.id,
      idTipoEvento: parseInt(idTipoEvento),
      direccion,
      fechaHora:    new Date(`${fecha}T${hora}`).toISOString(),
      notas:        notas || undefined,
      servicios,
    };

    setEnviando(true);
    try {
      await apiClient.post('/eventos', payload);
      router.push('/agenda');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el evento');
    } finally {
      setEnviando(false);
    }
  };

  const loadingInicial = loadingCatalogos || loadingClientes;

  return (
    <>
      {modalAbierto && (
        <ModalNuevoCliente
          onCreado={handleClienteCreado}
          onCerrar={() => setModalAbierto(false)}
        />
      )}

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Encabezado */}
        <div className="flex items-center gap-3">
          <Link
            href="/agenda"
            className="text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            ← Agenda
          </Link>
          <span className="text-border">·</span>
          <h1 className="text-text-primary font-bold text-xl">Nuevo Evento</h1>
        </div>

        {loadingInicial ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Cliente */}
            <div className={SECTION_CLS}>
              <h2 className="text-text-primary font-semibold text-sm">Cliente</h2>
              <BuscadorCliente
                clientes={clientes}
                seleccionado={clienteSeleccionado}
                onSelect={setClienteSeleccionado}
                onLimpiar={() => setClienteSeleccionado(null)}
                onCrearNuevo={() => setModalAbierto(true)}
              />
            </div>

            {/* Datos del evento */}
            <div className={SECTION_CLS}>
              <h2 className="text-text-primary font-semibold text-sm">Datos del evento</h2>

              <div>
                <label className={LABEL_CLS}>Tipo de evento *</label>
                <select
                  required
                  value={idTipoEvento}
                  onChange={e => setIdTipoEvento(e.target.value)}
                  className={INPUT_CLS}
                >
                  <option value="">Selecciona un tipo...</option>
                  {tiposEvento.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Fecha *</label>
                  <input
                    required
                    type="date"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Hora *</label>
                  <input
                    required
                    type="time"
                    value={hora}
                    onChange={e => setHora(e.target.value)}
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              <div>
                <label className={LABEL_CLS}>Dirección *</label>
                <input
                  required
                  type="text"
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                  placeholder="Av. ejemplo 123, distrito"
                  maxLength={300}
                  className={INPUT_CLS}
                />
              </div>
            </div>

            {/* Servicios */}
            <div className={SECTION_CLS}>
              <h2 className="text-text-primary font-semibold text-sm">Servicios</h2>

              {/* Fotografía */}
              <ServicioCard
                titulo="Fotografía"
                activo={fotografia.activo}
                precio={fotografia.precio}
                onToggle={() => setFotografia(f => ({ ...f, activo: !f.activo }))}
                onPrecio={v => setFotografia(f => ({ ...f, precio: v }))}
              >
                <div className="flex flex-wrap gap-4">
                  <CheckOption
                    label="Entrega digital"
                    checked={fotografia.esDigital}
                    onChange={v => setFotografia(f => ({ ...f, esDigital: v }))}
                  />
                  <CheckOption
                    label="Entrega física"
                    checked={fotografia.esFisica}
                    onChange={v => setFotografia(f => ({ ...f, esFisica: v, tipoPapel: v ? f.tipoPapel : '' }))}
                  />
                </div>

                {fotografia.esFisica && (
                  <div>
                    <label className={LABEL_CLS}>Tipo de papel</label>
                    <select
                      value={fotografia.tipoPapel}
                      onChange={e => setFotografia(f => ({ ...f, tipoPapel: e.target.value as TipoPapel | '' }))}
                      className={INPUT_CLS}
                    >
                      <option value="">Sin especificar</option>
                      <option value="BRILLO">Brillo</option>
                      <option value="MATE">Mate</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className={LABEL_CLS}>Notas</label>
                  <input
                    type="text"
                    value={fotografia.notas}
                    onChange={e => setFotografia(f => ({ ...f, notas: e.target.value }))}
                    placeholder="Observaciones adicionales..."
                    maxLength={300}
                    className={INPUT_CLS}
                  />
                </div>
              </ServicioCard>

              {/* Filmación */}
              <ServicioCard
                titulo="Filmación"
                activo={filmacion.activo}
                precio={filmacion.precio}
                onToggle={() => setFilmacion(f => ({ ...f, activo: !f.activo }))}
                onPrecio={v => setFilmacion(f => ({ ...f, precio: v }))}
              >
                <CheckOption
                  label="Incluye highlight"
                  checked={filmacion.incluyeHighlight}
                  onChange={v => setFilmacion(f => ({ ...f, incluyeHighlight: v }))}
                />
                <div>
                  <label className={LABEL_CLS}>Notas</label>
                  <input
                    type="text"
                    value={filmacion.notas}
                    onChange={e => setFilmacion(f => ({ ...f, notas: e.target.value }))}
                    placeholder="Observaciones adicionales..."
                    maxLength={300}
                    className={INPUT_CLS}
                  />
                </div>
              </ServicioCard>

              {/* Cuadro Firma */}
              <ServicioCard
                titulo="Cuadro Firma"
                activo={cuadroFirma.activo}
                precio={cuadroFirma.precio}
                onToggle={() => setCuadroFirma(f => ({ ...f, activo: !f.activo }))}
                onPrecio={v => setCuadroFirma(f => ({ ...f, precio: v }))}
              >
                <div>
                  <label className={LABEL_CLS}>Descripción *</label>
                  <input
                    type="text"
                    required={cuadroFirma.activo}
                    value={cuadroFirma.descripcion}
                    onChange={e => setCuadroFirma(f => ({ ...f, descripcion: e.target.value }))}
                    placeholder="Ej: Cuadro 60x40 con firmas de invitados"
                    maxLength={300}
                    className={INPUT_CLS}
                  />
                </div>
              </ServicioCard>
            </div>

            {/* Notas internas */}
            <div className={SECTION_CLS}>
              <h2 className="text-text-primary font-semibold text-sm">Notas internas</h2>
              <textarea
                value={notas}
                onChange={e => setNotas(e.target.value)}
                placeholder="Observaciones del equipo (solo visibles internamente)..."
                rows={3}
                className={`${INPUT_CLS} resize-none`}
              />
            </div>

            {/* Error y submit */}
            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-md px-4 py-3 text-danger text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Link
                href="/agenda"
                className="flex-1 border border-border text-text-secondary hover:text-text-primary text-sm font-medium py-2.5 rounded-md text-center transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={enviando}
                className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-bg-base font-medium text-sm py-2.5 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {enviando && (
                  <span className="w-4 h-4 border-2 border-bg-base border-t-transparent rounded-full animate-spin" />
                )}
                {enviando ? 'Guardando...' : 'Crear evento'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function ServicioCard({
  titulo,
  activo,
  precio,
  onToggle,
  onPrecio,
  children,
}: {
  titulo: string;
  activo: boolean;
  precio: string;
  onToggle: () => void;
  onPrecio: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`border rounded-md transition-colors ${activo ? 'border-primary/30 bg-primary/5' : 'border-border'}`}>
      {/* Toggle header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            activo ? 'bg-primary border-primary' : 'border-border'
          }`}>
            {activo && <span className="text-bg-base text-xs font-bold leading-none">✓</span>}
          </span>
          <span className={`text-sm font-medium ${activo ? 'text-text-primary' : 'text-text-secondary'}`}>
            {titulo}
          </span>
        </div>
        {activo && (
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <span className="text-text-secondary text-xs">S/</span>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={precio}
              onChange={e => onPrecio(e.target.value)}
              placeholder="0.00"
              className="w-24 bg-bg-elevated border border-border rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-primary text-right"
            />
          </div>
        )}
      </button>

      {/* Detalle del servicio */}
      {activo && (
        <div className="px-4 pb-4 space-y-3 border-t border-primary/10">
          <div className="pt-3">{children}</div>
        </div>
      )}
    </div>
  );
}

function CheckOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="accent-primary w-4 h-4"
      />
      <span className="text-text-primary text-sm">{label}</span>
    </label>
  );
}
