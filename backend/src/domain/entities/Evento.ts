// Los enums definen los valores válidos para tipo y estado.
// En .NET serían: public enum TipoEvento { Boda, Quinceanera, ... }
export enum TipoEvento {
  BODA = 'BODA',
  QUINCEANERA = 'QUINCEANERA',
  BAUTIZO = 'BAUTIZO',
  BABY_SHOWER = 'BABY_SHOWER',
  CUMPLEANOS = 'CUMPLEANOS',
  SESION_FOTOGRAFICA = 'SESION_FOTOGRAFICA',
  OTRO = 'OTRO',
}

export enum EstadoEvento {
  PENDIENTE = 'PENDIENTE',
  EN_ENTREGA = 'EN_ENTREGA',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO',
}

export interface Evento {
  id: string;
  nombre: string;        // Ej: "Boda Castillo - García"
  fecha: Date;
  tipoEvento: TipoEvento;
  estado: EstadoEvento;
  notas?: string;
  clienteId: string;     // Clave foránea — el ID del cliente dueño de este evento
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface CrearEventoDto {
  nombre: string;
  fecha: Date;
  tipoEvento: TipoEvento;
  clienteId: string;
  notas?: string;
}

export interface ActualizarEventoDto {
  nombre?: string;
  fecha?: Date;
  tipoEvento?: TipoEvento;
  estado?: EstadoEvento;
  notas?: string;
}
