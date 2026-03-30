// Tabla intermedia entre eventos y tipos_servicio.
// Registra qué servicios tiene un evento y a qué precio se acordó cada uno.
// Cada registro tiene su tabla de detalle correspondiente según el tipo:
//   idTipoServicio = 1 → detalle_fotografia
//   idTipoServicio = 2 → detalle_filmacion
//   idTipoServicio = 3 → detalle_cuadrofirma
//
// En .NET equivale a una entidad de unión con datos propios (precio),
// no a un simple many-to-many sin datos adicionales.

export interface EventoServicio {
  id: number;
  idEvento: number;         // FK → eventos
  idTipoServicio: number;   // FK → tipos_servicio
  precio: number;           // Precio acordado en Soles (PEN)
}

export interface CrearEventoServicioDto {
  idEvento: number;
  idTipoServicio: number;
  precio: number;
}
