'use client';
import type { EventoResumen } from '@/types';

interface Props {
  eventos: EventoResumen[];
}

interface GrupoFecha {
  label: string;
  esHoy: boolean;
  eventos: EventoResumen[];
}

function agruparEventos(eventos: EventoResumen[]): GrupoFecha[] {
  const ahora = new Date();
  const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

  // Solo eventos de hoy en adelante, ordenados por fecha
  const futuros = eventos
    .filter(e => new Date(e.fechaHora) >= inicioHoy)
    .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());

  const mapa = new Map<string, { fecha: Date; esHoy: boolean; eventos: EventoResumen[] }>();

  for (const evento of futuros) {
    const f = new Date(evento.fechaHora);
    const key = `${f.getFullYear()}-${f.getMonth()}-${f.getDate()}`;

    if (!mapa.has(key)) {
      const diaEvento = new Date(f.getFullYear(), f.getMonth(), f.getDate());
      mapa.set(key, {
        fecha:  diaEvento,
        esHoy:  diaEvento.getTime() === inicioHoy.getTime(),
        eventos: [],
      });
    }
    mapa.get(key)!.eventos.push(evento);
  }

  const manana = new Date(inicioHoy);
  manana.setDate(manana.getDate() + 1);

  return Array.from(mapa.values()).map(g => {
    let label: string;
    if (g.esHoy) {
      label = 'Hoy';
    } else if (g.fecha.getTime() === manana.getTime()) {
      label = 'Mañana';
    } else {
      label = g.fecha.toLocaleDateString('es-PE', {
        weekday: 'long',
        day:     'numeric',
        month:   'long',
      });
      label = label.charAt(0).toUpperCase() + label.slice(1);
    }

    return { label, esHoy: g.esHoy, eventos: g.eventos };
  });
}

function horaCorta(fechaIso: string): string {
  return new Date(fechaIso).toLocaleTimeString('es-PE', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function ListaEventos({ eventos }: Props) {
  const grupos = agruparEventos(eventos);

  if (grupos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-text-secondary text-sm">No hay eventos próximos</p>
        <p className="text-text-disabled text-xs mt-1">Los eventos pasados no aparecen en esta vista</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {grupos.map(grupo => (
        <section key={grupo.label}>
          {/* Encabezado de fecha */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                grupo.esHoy
                  ? 'bg-primary text-bg-base'
                  : 'bg-bg-elevated text-text-secondary'
              }`}
            >
              {grupo.label}
            </span>
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="text-text-disabled text-xs">
              {grupo.eventos.length} evento{grupo.eventos.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Cards de eventos */}
          <div className="space-y-2">
            {grupo.eventos.map(evento => (
              <div
                key={evento.id}
                className={`bg-bg-surface border rounded-lg px-4 py-3 flex items-start gap-4 hover:border-primary/30 transition-colors ${
                  grupo.esHoy ? 'border-primary/20' : 'border-border'
                }`}
              >
                {/* Hora */}
                <div className="flex-shrink-0 text-center w-12">
                  <p className="text-primary font-semibold text-sm leading-tight">
                    {horaCorta(evento.fechaHora)}
                  </p>
                </div>

                {/* Separador vertical */}
                <div className={`w-px self-stretch flex-shrink-0 ${grupo.esHoy ? 'bg-primary/30' : 'bg-border'}`} />

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-text-primary font-medium text-sm truncate">
                      {evento.nombreCliente}
                    </p>
                    <span className="text-xs bg-bg-elevated text-text-secondary px-2 py-0.5 rounded flex-shrink-0">
                      {evento.nombreTipoEvento}
                    </span>
                  </div>
                  <p className="text-text-disabled text-xs mt-0.5 truncate">
                    {evento.direccion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
