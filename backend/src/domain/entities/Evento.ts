// Centro del sistema — todo contrato se genera desde un evento.
// idTipoEvento referencia la tabla catálogo tipos_evento en lugar
// de un enum fijo, lo que permite agregar tipos sin cambiar código.

export interface Evento {
  id: number;
  idCliente: number;
  idTipoEvento: number;
  direccion: string;
  fechaHora: Date;
  notas?: string;
  activo: boolean;
}

// EventoResumen: versión enriquecida para listados (agenda/calendario).
// Incluye nombres de catálogo para evitar N+1 en el frontend.
export interface EventoResumen extends Evento {
  nombreCliente: string;
  nombreTipoEvento: string;
}

export interface DetallesFotografiaDto {
  esDigital: boolean;
  esFisica: boolean;
  tipoPapel?: 'BRILLO' | 'MATE' | null;
  notas?: string | null;
}

export interface DetallesFilmacionDto {
  incluyeHighlight: boolean;
  notas?: string | null;
}

export interface DetallesCuadroFirmaDto {
  descripcion: string;
}

export interface CrearServicioEventoDto {
  idTipoServicio: number;
  precio: number;
  detalleFotografia?: DetallesFotografiaDto;
  detalleFilmacion?: DetallesFilmacionDto;
  detalleCuadroFirma?: DetallesCuadroFirmaDto;
}

// Al crear un evento se registran también sus servicios en la misma transacción.
export interface CrearEventoDto {
  idCliente: number;
  idTipoEvento: number;
  direccion: string;
  fechaHora: Date;
  notas?: string;
  servicios?: CrearServicioEventoDto[];
}

export interface ActualizarEventoDto {
  idTipoEvento?: number;
  direccion?: string;
  fechaHora?: Date;
  notas?: string;
}
