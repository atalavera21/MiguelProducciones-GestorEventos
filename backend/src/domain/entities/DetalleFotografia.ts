// Detalle específico del servicio de fotografía para un evento.
// Existe un registro por cada EventoServicio de tipo Fotografía.
//
// Regla de negocio: la fotografía física es siempre limitada.
// esFisica = true implica cantidad acordada verbalmente y anotada en notas.

export enum TipoPapel {
  BRILLO = 'BRILLO',
  MATE   = 'MATE',
}

export interface DetalleFotografia {
  id: number;
  idEventoServicio: number;
  esDigital: boolean;       // Default: true — entrega por link de descarga
  esFisica: boolean;        // Default: false — impresión física limitada
  tipoPapel?: TipoPapel;    // Solo aplica si esFisica = true
  notas?: string;
}

export interface CrearDetalleFotografiaDto {
  idEventoServicio: number;
  esDigital: boolean;
  esFisica: boolean;
  tipoPapel?: TipoPapel;
  notas?: string;
}
