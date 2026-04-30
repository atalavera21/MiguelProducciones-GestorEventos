'use client';
import { useState } from 'react';
import type { EventoResumen } from '@/types';

interface Props {
  eventos: EventoResumen[];
}

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

interface DiaCalendario {
  fecha: Date | null;
  esHoy: boolean;
}

function generarDias(anio: number, mes: number): DiaCalendario[] {
  const primero    = new Date(anio, mes, 1);
  const ultimoDia  = new Date(anio, mes + 1, 0).getDate();
  // (getDay() + 6) % 7 convierte Domingo=0 a Domingo=6 (semana desde lunes)
  const offset     = (primero.getDay() + 6) % 7;

  const hoy  = new Date();
  const dias: DiaCalendario[] = [];

  for (let i = 0; i < offset; i++) dias.push({ fecha: null, esHoy: false });

  for (let d = 1; d <= ultimoDia; d++) {
    const fecha = new Date(anio, mes, d);
    dias.push({
      fecha,
      esHoy:
        d === hoy.getDate() &&
        mes === hoy.getMonth() &&
        anio === hoy.getFullYear(),
    });
  }

  // Completa la última fila para que el grid siempre tenga filas completas
  const resto = dias.length % 7;
  if (resto !== 0) {
    for (let i = 0; i < 7 - resto; i++) dias.push({ fecha: null, esHoy: false });
  }

  return dias;
}

function eventosDeDia(eventos: EventoResumen[], fecha: Date): EventoResumen[] {
  return eventos.filter(e => {
    const ef = new Date(e.fechaHora);
    return (
      ef.getDate()     === fecha.getDate() &&
      ef.getMonth()    === fecha.getMonth() &&
      ef.getFullYear() === fecha.getFullYear()
    );
  });
}

function horaCorta(fechaIso: string): string {
  return new Date(fechaIso).toLocaleTimeString('es-PE', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function CalendarioMensual({ eventos }: Props) {
  const hoy = new Date();
  const [mes,  setMes]  = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());

  const irAnterior = () => {
    if (mes === 0) { setMes(11); setAnio(a => a - 1); }
    else setMes(m => m - 1);
  };

  const irSiguiente = () => {
    if (mes === 11) { setMes(0); setAnio(a => a + 1); }
    else setMes(m => m + 1);
  };

  const dias = generarDias(anio, mes);

  return (
    <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
      {/* Navegación de mes */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button
          onClick={irAnterior}
          className="w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors text-xl leading-none"
        >
          ‹
        </button>
        <h2 className="text-text-primary font-semibold text-base">
          {MESES[mes]} {anio}
        </h2>
        <button
          onClick={irSiguiente}
          className="w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors text-xl leading-none"
        >
          ›
        </button>
      </div>

      {/* Cabecera días de la semana */}
      <div className="grid grid-cols-7 border-b border-border bg-bg-base/30">
        {DIAS_SEMANA.map(dia => (
          <div key={dia} className="py-2 text-center text-xs font-medium text-text-disabled uppercase tracking-wider">
            {dia}
          </div>
        ))}
      </div>

      {/* Grid de celdas */}
      <div className="grid grid-cols-7">
        {dias.map((dia, idx) => {
          if (!dia.fecha) {
            return (
              <div
                key={`vacio-${idx}`}
                className="min-h-[110px] border-b border-r border-border-subtle bg-bg-base/20 last:border-r-0"
              />
            );
          }

          const eventosDia   = eventosDeDia(eventos, dia.fecha);
          const tieneEventos = eventosDia.length > 0;

          return (
            <div
              key={dia.fecha.toISOString()}
              className={`min-h-[110px] border-b border-r border-border-subtle p-2 transition-colors last:border-r-0 ${
                dia.esHoy ? 'bg-primary/5' : 'hover:bg-bg-elevated/20'
              }`}
            >
              {/* Número del día */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full flex-shrink-0 ${
                    dia.esHoy
                      ? 'bg-primary text-bg-base'
                      : tieneEventos
                      ? 'text-text-primary'
                      : 'text-text-disabled'
                  }`}
                >
                  {dia.fecha.getDate()}
                </span>
                {/* Punto indicador cuando hay eventos y no es hoy */}
                {tieneEventos && !dia.esHoy && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                )}
              </div>

              {/* Chips de eventos */}
              <div className="space-y-1">
                {eventosDia.slice(0, 3).map(evento => (
                  <div
                    key={evento.id}
                    title={`${evento.nombreCliente} — ${evento.nombreTipoEvento} — ${horaCorta(evento.fechaHora)}`}
                    className="flex items-center gap-1 border-l-2 border-primary bg-primary/10 rounded-r-sm px-1.5 py-0.5 overflow-hidden"
                  >
                    <span className="text-text-primary text-xs font-medium truncate leading-tight min-w-0">
                      {evento.nombreCliente}
                    </span>
                    <span className="text-text-disabled text-xs flex-shrink-0 leading-tight">
                      {horaCorta(evento.fechaHora)}
                    </span>
                  </div>
                ))}
                {eventosDia.length > 3 && (
                  <p className="text-text-disabled text-xs px-1">
                    +{eventosDia.length - 3} más
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
