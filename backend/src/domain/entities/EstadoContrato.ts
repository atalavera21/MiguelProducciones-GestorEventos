// Catálogo de estados del contrato.
// Se usa ESTADOS_CONTRATO para evitar números mágicos en el código
// de negocio — en vez de escribir idEstado === 3, se escribe
// idEstado === ESTADOS_CONTRATO.TERMINADO.
//
// Flujo normal:  Pendiente → PendienteEntrega → Terminado
// Cancelación:   Pendiente → Cancelado
//                PendienteEntrega → Cancelado

export const ESTADOS_CONTRATO = {
  PENDIENTE:         1,
  PENDIENTE_ENTREGA: 2,
  TERMINADO:         3,
  CANCELADO:         4,
} as const;

export type NombreEstadoContrato = keyof typeof ESTADOS_CONTRATO;

export interface EstadoContrato {
  id: number;
  nombre: string;
}
