// Detalle específico del servicio de filmación para un evento.
// Existe un registro por cada EventoServicio de tipo Filmación.

export interface DetalleFilmacion {
  id: number;
  idEventoServicio: number;
  incluyeHighlight: boolean; // Default: true — video resumen del evento incluido
  notas?: string;
}

export interface CrearDetalleFilmacionDto {
  idEventoServicio: number;
  incluyeHighlight: boolean;
  notas?: string;
}
