// Centro del sistema — todo contrato se genera desde un evento.
// idTipoEvento referencia la tabla catálogo tipos_evento en lugar
// de un enum fijo, lo que permite agregar tipos sin cambiar código.

export interface Evento {
  id: number;
  idCliente: number;       // FK → clientes
  idTipoEvento: number;    // FK → tipos_evento (catálogo administrable)
  direccion: string;
  fechaHora: Date;         // Fecha y hora de inicio del evento
  notas?: string;          // Observaciones internas del equipo
}

// Al crear un evento se registran también sus servicios (EventoServicio).
// El estado del evento se deriva del estado de su contrato, no se guarda aquí.
export interface CrearEventoDto {
  idCliente: number;
  idTipoEvento: number;
  direccion: string;
  fechaHora: Date;
  notas?: string;
}

export interface ActualizarEventoDto {
  idTipoEvento?: number;
  direccion?: string;
  fechaHora?: Date;
  notas?: string;
}
